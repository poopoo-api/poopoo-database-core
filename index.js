import express from "express";
import { v4 as uuidV4 } from "uuid";
import cors from 'cors'
import * as fs from 'fs'
import { createHash } from 'node:crypto'
import bodyParser from "body-parser";
const developerToken = ""

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.status(200)
    res.json({
        message: "main page"
    })
})

app.get('/new-token', async (req, res) => {
    const devToken = req.headers.authToken // cooler xD
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
    } else {
        res.status(403)
        res.json({
            message: 'forbidden'
        })
    }
})

app.post('/create-user', async (req, res) => {
    const authorization = req.headers.authToken
    if(authorization === developerToken) {
        const userId = req.body.userId
        const auth = uuidV4()
        const storeAuth = createHash('sha256').update(auth).digest('hex')
        const json = JSON.stringify(fs.readFileSync('./users.json'))
        json[userId] = storeAuth
        fs.writeFileSync('./users.json', JSON.stringify(json))
        res.status(200)
        res.json({
            message: "OK"
        })
    } else {
        res.status(403)
        res.json({
            message: "forbidden"
        })
    }
})

app.get('/get-collection', (req, res) => {
    const authorization = req.headers.authToken;
    const authId = req.headers.authId
    const authCode = createHash('sha256').update(authorization).digest('hex')
    const JsonData = JSON.parse(fs.readFileSync('./users.json'))
    if(!JsonData[authId]) {
        res.status(401)
        return res.json({
            message: "Unauthorized"
        })
    }
    if(!JsonData[authId] !== authCode) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        })
    }
})

app.listen(3000)