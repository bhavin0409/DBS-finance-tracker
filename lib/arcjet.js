import arcjet, { tokenBucket } from "@arcjet/next" 

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["userId"], // Track based on userId
    rules: [
        tokenBucket({
            mode: "LIVE",
            refillRate: 20,
            interval: 3600,
            capacity: 20,
        }),
    ]
});

export default aj;