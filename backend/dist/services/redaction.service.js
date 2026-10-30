"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeControlCharacters = sanitizeControlCharacters;
exports.computePayloadHash = computePayloadHash;
exports.findLineNumber = findLineNumber;
exports.runDeterministicScan = runDeterministicScan;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Strips non-printable control characters (except \n, \r, \t) from input payloads
 * prior to dispatching to Grok API or internal scanners.
 */
function sanitizeControlCharacters(input) {
    // Remove ASCII control characters 0x00-0x08, 0x0B, 0x0C, 0x0E-0x1F, 0x7F
    return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}
/**
 * Computes a deterministic SHA-256 hash of the raw payload for audit logging
 * without storing raw unredacted sensitive payloads in plain text.
 */
function computePayloadHash(payload) {
    return crypto_1.default.createHash('sha256').update(payload, 'utf8').digest('hex');
}
/**
 * Finds the 1-based line number where a token first appears in the payload.
 */
function findLineNumber(payload, token) {
    if (!token)
        return 1;
    const idx = payload.indexOf(token);
    if (idx === -1)
        return 1;
    return payload.substring(0, idx).split('\n').length;
}
const DETECTION_RULES = [
    // 1. SECRETS & CREDENTIAL EXPOSURE
    {
        category: 'SECRET_EXPOSURE',
        severity: 'Critical',
        regex: /\b(sk-[a-zA-Z0-9_-]{16,}|xai-[a-zA-Z0-9_-]{16,}|ghp_[a-zA-Z0-9]{20,}|glpat-[a-zA-Z0-9_-]{20,}|AIza[0-9A-Za-z_-]{35})\b/g,
        placeholder: '[REDACTED_API_KEY]',
        description: 'High-entropy API secret key or developer token exposed in payload.',
        remediation: 'Revoke the exposed API key immediately, rotate credentials in your secret manager (Vault / AWS Secrets Manager), and reference via environment variables.',
    },
    {
        category: 'SECRET_EXPOSURE',
        severity: 'Critical',
        regex: /\b(AKIA[0-9A-Z]{16})\b/g,
        placeholder: '[REDACTED_AWS_KEY]',
        description: 'AWS IAM Access Key ID detected in plaintext.',
        remediation: 'Deactivate the IAM access key in AWS Console, audit CloudTrail logs for unauthorized usage, and migrate to IAM Roles with temporary STS tokens.',
    },
    {
        category: 'SECRET_EXPOSURE',
        severity: 'Critical',
        regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
        placeholder: '[REDACTED_PRIVATE_KEY]',
        description: 'Cryptographic Private Key block exposed directly in input stream.',
        remediation: 'Never transmit private keys in prompts or code snippets. Re-generate the keypair and revoke any associated certificates or SSH authorized_keys entries.',
    },
    {
        category: 'SECRET_EXPOSURE',
        severity: 'High',
        regex: /\beyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/g,
        placeholder: '[REDACTED_JWT]',
        description: 'JSON Web Token (JWT) bearer credential detected in payload.',
        remediation: 'Invalidate the active session token, shorten JWT TTL expiration windows, and strip Authorization headers before logging or LLM ingestion.',
    },
    {
        category: 'SECRET_EXPOSURE',
        severity: 'Critical',
        regex: /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis):\/\/[^:\s]+:[^@\s]+@[^\s"']+/gi,
        placeholder: '[REDACTED_DB_URI]',
        description: 'Database connection URI containing embedded plaintext authentication credentials.',
        remediation: 'Move database connection strings to isolated server environment variables and enforce IAM/certificate authentication.',
    },
    // 2. PROMPT INJECTION & JAILBREAK
    {
        category: 'PROMPT_INJECTION',
        severity: 'Critical',
        regex: /(?:ignore\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|prompts|directives)|disregard\s+(?:all\s+)?(?:system|safety)\s+(?:rules|guidelines|instructions)|you\s+are\s+now\s+in\s+(?:DAN|developer|unrestricted|jailbreak)\s+mode|bypass\s+(?:all\s+)?(?:safety|content|security)\s+(?:filters|guardrails|policies)|reveal\s+(?:your\s+)?system\s+prompt)/gi,
        placeholder: '[BLOCKED_PROMPT_INJECTION_DIRECTIVE]',
        description: 'Adversarial prompt injection / jailbreak attempt aimed at overriding system instructions or extracting confidential system boundaries.',
        remediation: 'Enforce strict delimiter separation between system instructions and untrusted user input, apply input canary tokens, and reject payloads attempting instruction override.',
    },
    {
        category: 'PROMPT_INJECTION',
        severity: 'High',
        regex: /(?:\[SYSTEM\s*OVERRIDE\]|<\|im_start\|>system|###\s*System\s*Instruction:|sudo\s+mode\s+enabled|act\s+as\s+an\s+unfiltered)/gi,
        placeholder: '[BLOCKED_SYSTEM_SPOOFING]',
        description: 'Role-spoofing delimiter injection attempting to impersonate privileged system context tokens.',
        remediation: 'Strip special chat template control tokens (<|im_start|>, ### System) prior to LLM context construction.',
    },
    // 3. CODE EXECUTION & INJECTION
    {
        category: 'CODE_INJECTION',
        severity: 'Critical',
        regex: /(?:'\s*OR\s+'?1'?\s*=\s*'?1|;\s*DROP\s+TABLE\s+\w+|UNION\s+SELECT\s+NULL|EXEC\s+xp_cmdshell)/gi,
        placeholder: '[REDACTED_SQL_INJECTION]',
        description: 'SQL Injection (SQLi) attack vector attempting unauthorized query manipulation or schema destruction.',
        remediation: 'Replace string concatenation with parameterized prepared statements ($1, $2) and enforce least-privilege database roles.',
    },
    {
        category: 'CODE_INJECTION',
        severity: 'High',
        regex: /(?:<script\b[^>]*>[\s\S]*?<\/script>|javascript:\s*alert\s*\(|onerror\s*=\s*["'][^"']+["'])/gi,
        placeholder: '[REDACTED_XSS_VECTOR]',
        description: 'Cross-Site Scripting (XSS) executable payload detected in input.',
        remediation: 'Apply context-aware HTML entity encoding, sanitize DOM inputs with DOMPurify, and enforce a strict Content-Security-Policy (CSP).',
    },
    {
        category: 'CODE_INJECTION',
        severity: 'Critical',
        regex: /(?:;\s*rm\s+-rf\s+\/|&&\s*curl\s+[^\s]+\s*\|\s*(?:bash|sh)\b|\$\(\s*cat\s+\/etc\/passwd\s*\))/gi,
        placeholder: '[REDACTED_CMD_INJECTION]',
        description: 'OS Command Injection vector attempting arbitrary shell execution.',
        remediation: 'Avoid shell execution APIs (exec/system); use parameterized argument arrays (execFile) and strict allowlist validation.',
    },
    // 4. PRIVACY, PII & PHI VULNERABILITIES
    {
        category: 'PII_LEAK',
        severity: 'Critical',
        regex: /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g,
        placeholder: '[REDACTED_SSN]',
        description: 'U.S. Social Security Number (SSN) government identifier exposed in plaintext.',
        remediation: 'Redact SSNs before storage or external API transmission; tokenize identifiers using format-preserving encryption or salted hashes.',
    },
    {
        category: 'PII_LEAK',
        severity: 'Critical',
        regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
        placeholder: '[REDACTED_CREDIT_CARD]',
        description: 'Payment Card Primary Account Number (PAN) detected (PCI-DSS Requirement 3 violation).',
        remediation: 'Mask PAN displays to show at most the last 4 digits and replace raw card handling with PCI-compliant payment tokenization.',
    },
    {
        category: 'PII_LEAK',
        severity: 'High',
        regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
        placeholder: '[REDACTED_EMAIL]',
        description: 'Personal or corporate email address exposed in payload (GDPR Art. 4 / CCPA personal identifier).',
        remediation: 'Replace raw email addresses with pseudonymized user UUIDs or [REDACTED_EMAIL] placeholders prior to LLM processing.',
    },
    {
        category: 'PII_LEAK',
        severity: 'Medium',
        regex: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g,
        placeholder: '[REDACTED_PHONE]',
        description: 'Telephone number identifier detected in text stream.',
        remediation: 'Mask contact phone numbers before indexing logs or dispatching prompts to third-party AI providers.',
    },
    {
        category: 'COMPLIANCE_VIOLATION',
        severity: 'High',
        regex: /\b(?:MRN|Medical\s+Record\s+Number|Patient\s+ID|ICD-10\s*Code)\s*[:#]?\s*[A-Z0-9-]{4,15}\b/gi,
        placeholder: '[REDACTED_PHI_RECORD]',
        description: 'Protected Health Information (PHI) medical record identifier detected under HIPAA Privacy Rule.',
        remediation: 'Apply HIPAA Safe Harbor de-identification (45 CFR § 164.514) to strip all 18 PHI identifiers before processing.',
    },
];
/**
 * Deterministic security, privacy, and compliance scanner & redactor.
 * Used both to pre-enrich/verify Grok AI findings and as a zero-downtime fallback.
 */
function runDeterministicScan(rawPayload, sensitivityLevel = 'Standard', targetFrameworks = ['OWASP-LLM-Top10'], autoRedact = true) {
    const cleanPayload = sanitizeControlCharacters(rawPayload);
    let redactedPayload = cleanPayload;
    const flaggedItems = [];
    for (const rule of DETECTION_RULES) {
        const matches = Array.from(cleanPayload.matchAll(rule.regex));
        for (const match of matches) {
            const tokenFound = match[0];
            const lineNumber = findLineNumber(cleanPayload, tokenFound);
            flaggedItems.push({
                category: rule.category,
                severity: rule.severity,
                token_found: tokenFound,
                description: `${rule.description} [Frameworks: ${targetFrameworks.join(', ')}]`,
                remediation: rule.remediation,
                line_number: lineNumber,
                redacted_equivalent: rule.placeholder,
            });
            if (autoRedact) {
                redactedPayload = redactedPayload.split(tokenFound).join(rule.placeholder);
            }
        }
    }
    // Strict sensitivity checks for additional compliance / unverifiable patterns
    if (sensitivityLevel === 'Strict') {
        const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g;
        const ipMatches = Array.from(cleanPayload.matchAll(ipv4Regex));
        for (const match of ipMatches) {
            const tokenFound = match[0];
            if (!tokenFound.startsWith('127.') && !tokenFound.startsWith('0.')) {
                flaggedItems.push({
                    category: 'PII_LEAK',
                    severity: 'Low',
                    token_found: tokenFound,
                    description: `Network IPv4 address detected under Strict sensitivity mode (${targetFrameworks.join(', ')}).`,
                    remediation: 'Anonymize client IP octets (e.g., /24 masking) in compliance with GDPR IP address personal data rulings.',
                    line_number: findLineNumber(cleanPayload, tokenFound),
                    redacted_equivalent: '[REDACTED_IP_ADDRESS]',
                });
                if (autoRedact) {
                    redactedPayload = redactedPayload.split(tokenFound).join('[REDACTED_IP_ADDRESS]');
                }
            }
        }
    }
    const hasPii = flaggedItems.some((item) => item.category === 'PII_LEAK' || item.category === 'COMPLIANCE_VIOLATION');
    const hasSecurityThreat = flaggedItems.some((item) => item.category === 'PROMPT_INJECTION' ||
        item.category === 'SECRET_EXPOSURE' ||
        item.category === 'CODE_INJECTION');
    // Calculate severity weight deductions for Trust Score (0-100)
    const multiplier = sensitivityLevel === 'Strict' ? 1.25 : sensitivityLevel === 'Permissive' ? 0.75 : 1.0;
    let penalty = 0;
    for (const item of flaggedItems) {
        if (item.severity === 'Critical')
            penalty += 35 * multiplier;
        else if (item.severity === 'High')
            penalty += 22 * multiplier;
        else if (item.severity === 'Medium')
            penalty += 12 * multiplier;
        else if (item.severity === 'Low')
            penalty += 5 * multiplier;
    }
    const trustScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));
    let riskLevel = 'Pass';
    if (flaggedItems.some((i) => i.severity === 'Critical') || trustScore < 35) {
        riskLevel = 'Critical';
    }
    else if (flaggedItems.some((i) => i.severity === 'High') || trustScore < 60) {
        riskLevel = 'High';
    }
    else if (flaggedItems.some((i) => i.severity === 'Medium') || trustScore < 80) {
        riskLevel = 'Medium';
    }
    else if (flaggedItems.length > 0) {
        riskLevel = 'Low';
    }
    const executiveSummary = flaggedItems.length === 0
        ? `Payload passed all security, privacy, and compliance checks under ${sensitivityLevel} sensitivity for [${targetFrameworks.join(', ')}]. No PII leaks, exposed secrets, or prompt injection vectors were detected.`
        : `SentinelTrust AI identified ${flaggedItems.length} finding(s) across [${targetFrameworks.join(', ')}] under ${sensitivityLevel} sensitivity, resulting in a Trust Score of ${trustScore}/100 (${riskLevel} Risk). Immediate remediation is advised for all ${flaggedItems.filter((i) => i.severity === 'Critical' || i.severity === 'High').length} high/critical priority exposures before downstream LLM or database ingestion.`;
    return {
        trust_score: trustScore,
        risk_level: riskLevel,
        has_pii: hasPii,
        has_security_threat: hasSecurityThreat,
        redacted_payload: autoRedact ? redactedPayload : cleanPayload,
        flagged_items: flaggedItems,
        executive_summary: executiveSummary,
    };
}
