# Security Policy

## Supported Versions

We actively support the following versions of AI Council Orchestrator with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in AI Council Orchestrator, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **Email**: Send details to the maintainers (create a private issue first to get contact info)
2. **GitHub Security Advisories**: Use GitHub's private vulnerability reporting feature
3. **Direct Contact**: Contact the project maintainers directly

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity
- **Reproduction**: Steps to reproduce the issue
- **Environment**: Affected versions and configurations
- **Mitigation**: Any temporary workarounds you've identified

### Response Timeline

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Initial Assessment**: Initial assessment within 5 business days
- **Status Updates**: Regular updates every 5 business days
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Security Best Practices

When using AI Council Orchestrator:

#### For Developers
- **Keep Updated**: Always use the latest version
- **Secure Configuration**: Follow security configuration guidelines
- **API Keys**: Never commit API keys or secrets to version control
- **Input Validation**: Validate all user inputs before processing
- **Network Security**: Use HTTPS for all API communications

#### For Production Deployments
- **Environment Variables**: Store sensitive configuration in environment variables
- **Access Control**: Implement proper access controls and authentication
- **Monitoring**: Monitor for unusual activity and errors
- **Logging**: Enable security logging but avoid logging sensitive data
- **Updates**: Establish a process for timely security updates

### Scope

This security policy applies to:

- **Core Package**: The main `ai-council-orchestrator` package
- **Dependencies**: Security issues in our direct dependencies
- **Documentation**: Security-related documentation issues
- **Examples**: Security issues in provided examples

### Out of Scope

The following are generally out of scope:

- **Third-party Integrations**: Issues in third-party AI model APIs
- **User Configuration**: Issues caused by insecure user configuration
- **Development Dependencies**: Issues only affecting development dependencies
- **Social Engineering**: Issues requiring social engineering

### Recognition

We appreciate security researchers who help keep AI Council Orchestrator secure. With your permission, we'll acknowledge your contribution in:

- **Security Advisories**: Credit in published security advisories
- **Release Notes**: Recognition in relevant release notes
- **Contributors**: Addition to our contributors list

Thank you for helping keep AI Council Orchestrator and our users safe!

## Contact

For security-related questions or concerns, please contact the maintainers through the appropriate channels mentioned above.

---

**Last Updated**: December 30, 2024