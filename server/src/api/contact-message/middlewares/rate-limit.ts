/**
 * Rate limiting middleware for contact form
 */

const submissions = new Map();

export default (config, { strapi }) => {
  return async (ctx, next) => {
    const ip = ctx.request.ip;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxSubmissions = 3; // Max 3 submissions per minute

    // Clean old entries
    for (const [key, value] of submissions.entries()) {
      if (now - value.timestamp > windowMs) {
        submissions.delete(key);
      }
    }

    // Check current IP submissions
    const ipSubmissions = submissions.get(ip) || { count: 0, timestamp: now };

    if (ipSubmissions.count >= maxSubmissions && (now - ipSubmissions.timestamp) < windowMs) {
      return ctx.tooManyRequests('Too many contact form submissions. Please try again later.');
    }

    // Update submission count
    if ((now - ipSubmissions.timestamp) >= windowMs) {
      ipSubmissions.count = 1;
      ipSubmissions.timestamp = now;
    } else {
      ipSubmissions.count++;
    }

    submissions.set(ip, ipSubmissions);

    await next();
  };
};
