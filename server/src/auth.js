import jwt from 'jsonwebtoken'; import bcrypt from 'bcryptjs'; import { registry, business } from './db.js';
const secret = process.env.JWT_SECRET || 'development-only-change-me';
export const hash = (password) => bcrypt.hashSync(password, 12);
export const checkPassword = (password, hashValue) => bcrypt.compareSync(password, hashValue);
export function token(user) { return jwt.sign({ id:user.id, businessId:user.business_id, role:user.role }, secret, { expiresIn:'12h' }); }
export function requireAuth(req,res,next) { try { const value=req.headers.authorization?.replace('Bearer ',''); req.user=jwt.verify(value,secret); const user=registry.prepare('SELECT * FROM users WHERE id=?').get(req.user.id); if(!user?.active) return res.status(403).json({error:'Account is inactive'}); if(user.business_id && !business(user.business_id)?.active) return res.status(403).json({error:'Business is inactive'}); next(); } catch { res.status(401).json({error:'Authentication required'}); } }
export const allow = (...roles) => (req,res,next) => roles.includes(req.user.role) ? next() : res.status(403).json({error:'Not permitted'});
