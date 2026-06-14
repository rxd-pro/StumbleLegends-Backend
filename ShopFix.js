const { EconomyController } = require('./BackendUtils');
const Console = require("./ConsoleUtils");

module.exports = function(app) {
    Console.log("System", "🛠️ Injecting Ultimate Shop Fix...");

    // 1. Force accept BOTH GET and POST requests for every shop route
    app.all('/economy/purchase/:item', EconomyController.purchase); 
    app.all('/economy/purchasegasha/:itemId/:count', EconomyController.purchaseGasha); 
    app.all('/economy/purchaseluckyspin', EconomyController.purchaseLuckySpin); 
    app.all('/economy/purchasedrop/:itemId/:count', EconomyController.purchaseDrop); 
    
    // 🎯 THE FIX: Matching the exact URL the game client just revealed!
    app.all('/economy/purchaseluckyspinwheel', EconomyController.purchaseLuckySpinWheel);

    // 2. THE HTML KILLER: Intercept ALL missing routes and force them to return JSON
    app.use((req, res, next) => {
        Console.error("SHOP 404", `Client tried to hit a missing route: [${req.method}] ${req.originalUrl}`);
        res.status(404).json({ error: "ROUTE_NOT_FOUND", path: req.originalUrl });
    });
};
