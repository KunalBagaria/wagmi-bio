import { InvoiceType } from '@/layouts/UserInvoices';
import easyinvoice from 'easyinvoice';
import date from 'date-and-time'
import toast from 'react-hot-toast'

const fetchLinkDetails = async (link: string) => {
  try {
    const request = await fetch(`/api/get/user/${link}`)
    const response = await request.json()
    return response
  } catch (e) {
    console.log(e)
  }
}

const returnParsedPublicKey = (publicKey: string) => publicKey.substring(0, 4) + '....' + publicKey.substring(40, 44)

const data = async (invoice: InvoiceType) => {
  const linkDetails = await fetchLinkDetails(invoice.link)
  const d = {
    products: [{}],
    information: {
      number: String(invoice.invoiceNumber),
      date: date.format(new Date(invoice.createdAt), 'DD MMM, YYYY'),
      "due-date": date.format(new Date(invoice.dueDate), 'DD MMM, YYYY')
    },
    client: {
      company: invoice.client.name,
      zip: invoice.client.address ? invoice.client.address : `Status: ${invoice.status.includes('paid') ? 'Paid' : 'Pending'}`,
      address: invoice.client.email
    },
    sender: {
      company: linkDetails.name,
      zip: `wagmi.bio/${invoice.link}`,
      address: returnParsedPublicKey(linkDetails.publicKey)
    },
    images: {
      logo: 'https://wagmi.bio/padded-logo.png'
    },
    "bottom-notice": invoice.status.includes('paid') ? "This invoice has been marked as paid" : "Please pay this invoice within the due date"
  }
  d.products.pop()
  for (const particular of invoice.particulars) {
    d.products.push({ description: particular.name, price: particular.price, quantity: particular.quantity, "tax-rate": 0 })
  }
  return d;
};

export const generateInvoice = async (invoice: any, nd ? : boolean) => {
  const invoiceData = await data(invoice);
  const result = easyinvoice.createInvoice(invoiceData)
  toast.promise(result, {
    loading: 'Generating PDF',
    success: 'PDF Generated',
    error: 'Error Generating PDF'
  })
  const pdf = await result;
  if (nd) return pdf;
  easyinvoice.download(`WAGMI-${invoice.invoiceNumber}.pdf`, pdf.pdf)
}