'user server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
// just use the below so it clears the route cache after the data is entered into the database
import {revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
  }); 

  const CreateInvoice = FormSchema.omit({ id: true, date: true});


export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'), 
        status: formData.get('status'),
    });
    // Test it out:
    //console.log(rawFormData);

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    //after user enters the information, revalidate and then re-direct
    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')

}