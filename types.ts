declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGO_URL: string;
			AWS_SES_ACCESS_KEY_ID: string;
			AWS_SES_SECRET_ACCESS_KEY: string;
			AWS_SES_REGION: string;
			PORT ? : string;
      PAYMENT_WEBHOOK: string;
      INVOICE_WEBHOOK: string;
      REGISTRATION_WEBHOOK: string;
		}
	}
}

export type Invoice = {
	client: {
		name: string,
		address: string,
		email: string
	},
	link: string,
	reference?: string,
	token?: string,
	status ? : string,
	publicKey: string,
	dueDate: Date,
	createdAt: Date,
	particulars: {
		name: string;quantity: number;price: number;
	} [],
	invoiceNumber: number,
	amount: number
}

export type InvoiceTypes = {
	invoice: Invoice,
	link: any,
	price: number,
	dummy: boolean
}