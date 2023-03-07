import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import allowCors from '../../../utils/cors';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const contacts = await prisma.contact.findMany({})
            res.status(200).json({ contacts })
        } catch (error) {
            console.log("Failure");
        }

    } else if (req.method === 'POST') {
        const { name, email, message } = req.body

        try {
            await prisma.contact.create({
                data: {
                    name,
                    email,
                    message
                }
            })
            res.status(200).json({ message: 'contact Created' })
        } catch (error) {
            console.log("Failure");
        }
    }

}


export default allowCors(handler);