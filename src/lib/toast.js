'use client';

import { toast } from 'react-toastify';

const defaultOptions = {
  position: 'top-right',
  autoClose: 2500,
  hideProgressBar: true,
};

export function toastSuccess(message) {
  toast.success(message, defaultOptions);
}

export function toastError(message) {
  toast.error(message, defaultOptions);
}

export function toastInfo(message) {
  toast.info(message, defaultOptions);
}

export async function toastPromise(promise, { pending = 'Processing...', success = 'Done', error = 'Something went wrong' } = {}) {
  return toast.promise(promise, { pending, success, error }, defaultOptions);
}


