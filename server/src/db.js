import 'dotenv/config';
import { MongoClient } from 'mongodb';
import crypto from 'node:crypto';

let registryClient; let indexesReady; const tenantClients=new Map();
const registryName=process.env.REGISTRY_DATABASE||'sales_tracker_registry';
function encryptionKey(){const value=process.env.TENANT_URI_ENCRYPTION_KEY;if(!value)throw Error('TENANT_URI_ENCRYPTION_KEY is required');return crypto.createHash('sha256').update(value).digest()}
export function encrypt(value){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',encryptionKey(),iv);const body=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return `${iv.toString('base64')}.${cipher.getAuthTag().toString('base64')}.${body.toString('base64')}`}
export function decrypt(value){const [iv,tag,body]=value.split('.').map(x=>Buffer.from(x,'base64'));const cipher=crypto.createDecipheriv('aes-256-gcm',encryptionKey(),iv);cipher.setAuthTag(tag);return Buffer.concat([cipher.update(body),cipher.final()]).toString('utf8')}
export async function registry(){if(!process.env.REGISTRY_MONGODB_URI)throw Error('REGISTRY_MONGODB_URI is required');if(!registryClient){registryClient=new MongoClient(process.env.REGISTRY_MONGODB_URI);await registryClient.connect()}const db=registryClient.db(registryName);if(!indexesReady){await Promise.all([db.collection('businesses').createIndex({id:1},{unique:true}),db.collection('user_lookup').createIndex({email:1},{unique:true}),db.collection('users').createIndex({email:1},{unique:true})]);indexesReady=true}return db}
export async function tenantDb(uri,name){const key=crypto.createHash('sha256').update(uri).digest('hex');let client=tenantClients.get(key);if(!client){client=new MongoClient(uri,{maxPoolSize:5});await client.connect();tenantClients.set(key,client)}const db=client.db(name);await Promise.all([db.collection('sales').createIndex({id:1},{unique:true}),db.collection('users').createIndex({email:1},{unique:true}),db.collection('sales').createIndex({soldAt:-1})]);return db}
