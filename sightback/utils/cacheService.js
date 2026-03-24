// ===== SYSTEM DESIGN: IN-MEMORY CACHE SERVICE =====
// In a production microservice, this would be REDIS (Remote Dictionary Server).
// Since we are simulating, we use a Javascript Object as our High-Speed RAM.

class CacheService {
    constructor() {
        this.cache = new Map();
        this.TTL = 1000 * 60 * 5; // Default 5 minutes "Time To Live"
    }

    /**
     * @param {string} key - Unique key (e.g. "user_123_summary")
     * @param {any} value - Data to store
     */
    set(key, value) {
        console.log(`💾 [CACHE] SAVING data for key: ${key}`);
        this.cache.set(key, {
            data: value,
            expiry: Date.now() + this.TTL
        });
    }

    /**
     * @param {string} key 
     */
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            console.log(`🗑️ [CACHE] STALE data found for: ${key}. Deleting...`);
            this.cache.delete(key);
            return null;
        }

        console.log(`🏎️ [CACHE] HIT! Returning instant result for: ${key}`);
        return item.data;
    }

    /**
     * @param {string} userId - Invalidate all cache for a specific user
     */
    invalidate(userId) {
        console.log(`⚡ [CACHE] INVALIDATING all records for User: ${userId}`);
        for (const [key] of this.cache) {
            if (key.includes(userId)) {
                this.cache.delete(key);
            }
        }
    }
}

// Singleton Instance so the whole app shares one cache
module.exports = new CacheService();
