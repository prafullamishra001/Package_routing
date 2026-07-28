const logger = require('./logger');

class AlertingSystem {
  constructor() {
    this.alertChannels = {
      email: process.env.ALERT_EMAIL_ENABLED === 'true',
      slack: process.env.ALERT_SLACK_ENABLED === 'true',
      webhook: process.env.ALERT_WEBHOOK_ENABLED === 'true',
    };
  }

  async sendAlert(level, message, context = {}) {
    const alert = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    logger.error(`ALERT [${level}]: ${message}`, context);

    if (this.alertChannels.email) {
      await this.sendEmailAlert(alert);
    }

    if (this.alertChannels.slack) {
      await this.sendSlackAlert(alert);
    }

    if (this.alertChannels.webhook) {
      await this.sendWebhookAlert(alert);
    }
  }

  async sendEmailAlert(alert) {
    logger.info('Email alert would be sent', { alert });
  }

  async sendSlackAlert(alert) {
    logger.info('Slack alert would be sent', { alert });
  }

  async sendWebhookAlert(alert) {
    if (!process.env.ALERT_WEBHOOK_URL) {
      logger.warn('Webhook URL not configured');
      return;
    }

    try {
      const response = await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });

      if (!response.ok) {
        logger.error('Failed to send webhook alert', { status: response.status });
      }
    } catch (error) {
      logger.error('Webhook alert error', { error: error.message });
    }
  }

  async alertHighErrorRate(errorRate, threshold) {
    await this.sendAlert('CRITICAL', 'High error rate detected', {
      errorRate,
      threshold,
      recommendation: 'Investigate logs and consider rollback',
    });
  }

  async alertUnusualRoutingPattern(department, count, expectedRange) {
    await this.sendAlert('WARNING', 'Unusual routing pattern detected', {
      department,
      count,
      expectedRange,
      recommendation: 'Verify if this is expected or indicates a rule change',
    });
  }

  async alertAuthenticationFailure(ip, count) {
    await this.sendAlert('WARNING', 'Multiple authentication failures', {
      ip,
      count,
      recommendation: 'Consider IP blocking if pattern continues',
    });
  }

  async alertDatabaseConnectionFailure() {
    await this.sendAlert('CRITICAL', 'Database connection failure', {
      recommendation: 'Check database status and connection string',
    });
  }

  async alertConfigurationChange(configKey, oldValue, newValue) {
    await this.sendAlert('INFO', 'Configuration change detected', {
      configKey,
      oldValue,
      newValue,
      recommendation: 'Verify if change was intentional',
    });
  }
}

module.exports = new AlertingSystem();
