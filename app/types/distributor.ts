export interface Cattle {
  id: string
  age_range: string
  cattle_id: string
  cattle_type: string
  weight_range: string
}

export interface Farmer {
  id: string
  farmer_name: string
  address: string
  city: string
  state: string
  pin_code: string
  phone_no: string
  whatsapp_no: string
  email: string
  aadhar_no: string
  total_cattle: number
  cattle: Cattle[]
}

export interface Inward {
  id: string
  dispatch_id: string
  used_quantity: number
  total_quantity: number
  feed_concentrator: string
}

export interface Distributor {
  id: string
  name: string
  registration_number: string
  email: string
  phone_number: string
  address: string
  city: string
  state: string
  pin_code: string
  inwards?: Inward[]
  farmers?: Farmer[]
}
