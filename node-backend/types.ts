export interface Cattle {
  id: string
  cattle_id: string
  age_range: string
  weight_range: string
  cattle_type: string
}

export interface Farmer {
  id: string
  farmer_name: string
  distributor_id: string
  whatsapp_no: string
  phone_no: string
  email: string
  address: string
  state: string
  city: string
  pin_code: string
  aadhar_no: string
  total_cattle: number
  cattle: Cattle[]
}

export interface Inward {
  id: string
  feed_concentrator: string
  dispatch_id: string
  total_quantity: number
  used_quantity: number
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
