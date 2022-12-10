import express, {Express, Request, Response} from 'express'
import cors from 'cors';

const app:Express = express()
app.use(cors())
app.use(express.json())

app.post('/analytics', (req:Request, res:Response) => {})

app.listen(8082, 'analytics server is up and running on port 8082')
