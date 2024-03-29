const app = require("./src/app");
const PORT = 3055

const server = app.listen(PORT, () => {
    console.log(`Server eCommerce start with port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log(`Exit Server Express`)
        // notify send (ping....)
    })
})