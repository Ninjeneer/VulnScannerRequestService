import Stripe from "stripe";

export type StripeCheckoutSessionCompleted = {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: Data;
  livemode: boolean;
  pending_webhooks: number;
  request: Request;
  type: string;
}

type Request = {
  id?: any;
  idempotency_key?: any;
}

type Data = {
  object: Object;
}

type Object = {
  id: string;
  object: string;
  after_expiration?: any;
  allow_promotion_codes?: any;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: Automatictax;
  billing_address_collection?: any;
  cancel_url: string;
  client_reference_id?: any;
  consent?: any;
  consent_collection?: any;
  created: number;
  currency: string;
  currency_conversion?: any;
  custom_fields: any[];
  custom_text: Customtext;
  customer?: any;
  customer_creation: string;
  customer_details: Customerdetails;
  customer_email?: any;
  expires_at: number;
  invoice?: any;
  invoice_creation: Invoicecreation;
  livemode: boolean;
  locale?: any;
  metadata: Metadata;
  mode: string;
  payment_intent: string;
  payment_link?: any;
  payment_method_collection: string;
  payment_method_options: Metadata;
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: Phonenumbercollection;
  recovered_from?: any;
  setup_intent?: any;
  shipping_address_collection?: any;
  shipping_cost?: any;
  shipping_details?: any;
  shipping_options: any[];
  status: string;
  submit_type?: any;
  subscription?: any;
  success_url: string;
  total_details: Totaldetails;
  url?: any;
}

type Totaldetails = {
  amount_discount: number;
  amount_shipping: number;
  amount_tax: number;
}

type Phonenumbercollection = {
  enabled: boolean;
}

type Invoicecreation = {
  enabled: boolean;
  invoice_data: Invoicedata;
}

type Invoicedata = {
  account_tax_ids?: any;
  custom_fields?: any;
  description?: any;
  footer?: any;
  metadata: Metadata;
  rendering_options?: any;
}

type Metadata = Record<string, any>

type Customerdetails = {
  address: Address;
  email: string;
  name?: any;
  phone?: any;
  tax_exempt: string;
  tax_ids: any[];
}

type Address = {
  city?: any;
  country?: any;
  line1?: any;
  line2?: any;
  postal_code?: any;
  state?: any;
}

type Customtext = {
  shipping_address?: any;
  submit?: any;
}

type Automatictax = {
  enabled: boolean;
  status?: any;
}

export type StripeProduct = Stripe.Product & {
    metadata: {
        plan?: string
        credits?: number
    }
}