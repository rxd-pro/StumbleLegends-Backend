const { EconomyController } = require('./BackendUtils');
const Console = require("./ConsoleUtils");

module.exports = function(app) {
    Console.log("System", "🛠️ Injecting Ultimate Shop & Workshop Fixes...");

    // --- 1. SHOP FIXES ---
    // Force accept BOTH GET and POST requests for every shop route
    app.all('/economy/purchase/:item', EconomyController.purchase); 
    app.all('/economy/purchasegasha/:itemId/:count', EconomyController.purchaseGasha); 
    app.all('/economy/purchaseluckyspin', EconomyController.purchaseLuckySpin); 
    app.all('/economy/purchasedrop/:itemId/:count', EconomyController.purchaseDrop); 
    app.all('/economy/luckyspin', EconomyController.purchaseLuckySpinWheel);
    app.all('/economy/purchaseluckyspinwheel', EconomyController.purchaseLuckySpinWheel);

    // --- 2. WORKSHOP (UGC) FIXES ---
    // Send empty lists ONLY when the game looks for maps
    const emptyUgc = (req, res) => res.status(200).json([]);
    app.get('/ugc/v1/user/maps', emptyUgc);
    app.get('/ugc/v1/user/favorites', emptyUgc);
    app.get('/ugc/v1/user/likes', emptyUgc);
    app.get('/ugc/v1/user/history', emptyUgc);
    app.get('/ugc/v1/user/recently-played', emptyUgc);
    
    // Send "Fake Success" when the game tries to SAVE a map
    const fakeSaveSuccess = (req, res) => {
        Console.log("Workshop", "Map saved successfully!");
        res.status(200).json({
            id: "stumble_legends_map_" + Math.floor(Math.random() * 9999),
            version: 1,
            status: "DRAFT",
            name: "Saved Map"
        });
    };
    app.post('/ugc/v1/user/maps', fakeSaveSuccess);
    app.put('/ugc/v1/user/maps/:mapId', fakeSaveSuccess);
    app.post('/ugc/v1/user/maps/:mapId/publish', fakeSaveSuccess);

    // Keep the Workshop Create button unlocked
    app.all('/ugc/v1/config', (req, res) => res.status(200).json({
        isFeatureEnabled: true,
        maxSavedMaps: 50,
        maxPublishedMaps: 50
    }));

    // --- 3. THE HTML KILLER (MUST BE LAST) ---
    // Intercept ALL missing routes and force them to return JSON instead of crashing
    app.use((req, res, next) => {
        Console.error("404 ERROR", `Client tried to hit a missing route: [${req.method}] ${req.originalUrl}`);
        res.status(404).json({ error: "ROUTE_NOT_FOUND", path: req.originalUrl });
    });
};
