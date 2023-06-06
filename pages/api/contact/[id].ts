import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'DELETE', 'PUT'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const contactId = req.query.id

	await runMiddleware(req, res, cors);

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

	} else if (req.method === 'PUT') {
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