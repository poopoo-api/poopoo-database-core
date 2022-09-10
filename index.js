import express from "express";
import { v4 as uuidV4 } from "uuid";
import cors from 'cors'
import * as fs from 'fs'
import { createHash } from 'node:crypto'

const developerToken = ""

const app = express()
app.use(cors())

app.get('/', (_req, res) => {
    res.status(200)
    res.json({
        message: "main page"
    })
})

app.get('/new-token', async (req, res) => {
    const devToken = req.headers.authorization
    const json = {}
    const uid = uuidV4()
    if(devToken === developerToken) {
        try {
            if(fs.existsSync(`${__dirname}/users.json`)) {
                json[req.headers['user-id']] = createHash('sha256').update(uid).digest('hex')
                fs.writeFileSync('./users.json', JSON.stringify(json, null, 4))
                res.status(200)
                res.json({
                    message: "success"
                })
            } else {
                const exist = JSON.parse(fs.readFileSync('./users.json'))
                exist[req.headers['user-id']] = createHash('sha256').update(uid).digest('hex')
                fs.writeFileSync('./users.json', JSON.stringify(exist, null, 4))
                res.status(200)
                res.json({
                    message: "success"
                })
            }
        } catch {
            res.status(422)
            res.json({
                "message": "Unprocessable Entity"
            })
        }
    }
})

app.listen(3000)