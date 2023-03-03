import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const contactId = req.query.id

	if (req.method === 'GET') {
		try {
			const contact = await prisma.contact.findUnique({
				where: { id: Number(contactId) }
			})
			res.status(200).json({ contact })
		} catch (error) {
			console.log(`Contact ${contactId} not found`);
			res.status(404).send(`Contact ${contactId} not found`)
		}

	} else if (req.method === 'DELETE') {
		try {
			const contact = await prisma.contact.delete({
				where: { id: Number(contactId) }
			})
			res.json(contact)
		} catch {
			console.log(`Contact ${contactId} not deleted`);
			res.status(404).send(`Contact ${contactId} not deleted`)
		}

	} else if (req.method === 'POST') {
		try {
			const { name, email, message } = req.body
			const contact = await prisma.contact.update({
				where: { id: Number(contactId) },
				data: {
					name,
					email,
					message
				}

			})
			res.json(contact)
		} catch {
			console.log(`Contact ${contactId} not updated`);
			res.status(404).send(`Contact ${contactId} not updated`)
		}
	} else {
		res.status(404).send(`Method not available`)
	}
}