import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, income, type, cost } = req.body
  const { data: schemes } = await supabase.from('schemes').select('*')

  const matches = (schemes || []).map(s => {
    let met = 0;
    if (income <= 500000) met++;
    if (s.category_type === type) met++;
    if (cost <= s.max_amount) met++;
    return {
      scheme_name: s.name,
      match_score: Math.round((met / 3) * 100),
      eligible: met === 3,
      project_cost: cost
    }
  })

  await supabase.from('saved_recommendations').insert(matches.map(m => ({ ...m, email })))
  res.status(200).json(matches.sort((a,b) => b.match_score - a.match_score))
}
