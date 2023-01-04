import toast from "react-hot-toast"

const toastWarning = (message: string) => {
    if (typeof window === "undefined") return
    toast(message, {
      style: {
        border: '0.1rem solid #4575d2',
        padding: '1rem',
        color: '#4575d2',
      }
    })
}

export const imageNotValid = () => toastWarning('Please enter a valid image URL');


export const validateDescription = (description: string) => {
    const isLonger = description.length > 4000;
    if (!isLonger) return false;
    return true;
}

export const validateName = (name: string) => {
    const isLonger = name.length > 18;
    if (!isLonger) return false;
    return true;
}

export const validateBackground = (background: string) => {
    const backgrounds = ['one', 'two', 'three', 'four', 'five']
    if (backgrounds.includes(background)) return false;
    return true;
}

export const isImage = async (url: string) => {
    const res = await fetch(url);
    const buff = await res.blob();
    if (buff.type.startsWith('image/')) return true;
    imageNotValid();
    return false;
}

const isGreaterThan100Characters = (value: string) => value.length > 100;

export const validateInvoice = (invoice: any) => {
    if (!invoice.client.name && !isGreaterThan100Characters(invoice.client.name)) {
        toastWarning("Please enter the client's name");
        return true;
    }
    if (!invoice.client.email && !isGreaterThan100Characters(invoice.client.email)) {
        toastWarning("Please enter the client's email");
        return true;
    }

    const validEmail = invoice.client.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (!validEmail && !isGreaterThan100Characters(invoice.client.email)) {
        toastWarning("Please enter a valid email");
        return true;
    }

    if (!invoice.dueDate) {
        toastWarning("Please enter a due date");
        return true;
    }

    const { particulars } = invoice

    const nameExists = ({ name }: any) => name.length > 0 && name.length < 100;
    const quantityExists = ({ quantity }: any) => quantity > 0 && typeof quantity === 'number';
    const priceExists = ({ price }: any) => price > 0;

    const nameIsValid = particulars.every(nameExists);
    const quantityIsValid = particulars.every(quantityExists);
    const priceIsValid = particulars.every(priceExists);

    if (!nameIsValid) {
        toastWarning("Please enter a valid name for every item");
        return true;
    }
    if (!quantityIsValid) {
        toastWarning("Please enter a valid quantity for every item");
        return true;
    }
    if (!priceIsValid) {
        toastWarning("Please enter a valid price for every item");
        return true;
    }

    return false;
}