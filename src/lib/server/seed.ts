// src/lib/server/seed.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '$lib/server/db/schema/';
const DB_URL = "mysql://root:@localhost:3306/salonmain";

if (!DB_URL) throw new Error('DATABASE_URL is not set');

const client = mysql.createPool(DB_URL);

 const db = drizzle(client, { schema, mode: 'default' });
import { hash } from '@node-rs/argon2';
import { extractUsername, generateUserId } from '$lib/global.svelte';
import { roles, user } from './db/schema/user';
import { permissions, rolePermissions } from './db/schema/permissions';
import { branches } from '$lib/server/db/schema/branches';

import { eq } from 'drizzle-orm';

async function seed() {


  /* ---------- 1. Permissions ---------- */
const permissionData = [
  // Branches
  { name: "branch_view", description: "View branch details and locations." },
  { name: "branch_create", description: "Add a new branch to the system." },
  { name: "branch_edit", description: "Update branch information (address, contact, etc.)." },
  { name: "branch_delete", description: "Deactivate or archive a branch." },

  // Appointments
  { name: "appointment_view", description: "View all appointments (scheduled, completed, canceled)." },
  { name: "appointment_create", description: "Book new appointments for customers." },
  { name: "appointment_edit", description: "Reschedule, reassign, or update appointment details." },
  { name: "appointment_delete", description: "Cancel or remove an appointment (soft delete)." },

  // Appointment Statuses
  { name: "appointment_status_view", description: "View available appointment statuses (e.g., confirmed, no-show)." },
  { name: "appointment_status_create", description: "Create a new appointment status type." },
  { name: "appointment_status_edit", description: "Modify the name or description of an appointment status." },
  { name: "appointment_status_delete", description: "Deactivate or hide an appointment status." },

  // Customers
  { name: "customer_view", description: "View customer profiles, history, and contact info." },
  { name: "customer_create", description: "Register a new customer in the system." },
  { name: "customer_edit", description: "Update customer details (name, phone, address, etc.)." },
  { name: "customer_delete", description: "Archive or deactivate a customer profile." },

  // Customer Contacts (e.g., email, alternate phone)
  { name: "customer_contact_view", description: "View additional customer contact methods." },
  { name: "customer_contact_create", description: "Add new contact info for a customer (e.g., email, WhatsApp)." },
  { name: "customer_contact_edit", description: "Update existing customer contact details." },
  { name: "customer_contact_delete", description: "Remove or disable a customer contact method." },

  // Services
  { name: "service_view", description: "Browse all available salon services." },
  { name: "service_create", description: "Add a new service (e.g., haircut, coloring) with price and duration." },
  { name: "service_edit", description: "Update service details like price, duration, or commission." },
  { name: "service_delete", description: "Deactivate or hide a service from booking." },

  // Service Categories
  { name: "service_category_view", description: "View service groupings (e.g., Hair, Nails, Spa)." },
  { name: "service_category_create", description: "Create a new service category." },
  { name: "service_category_edit", description: "Rename or update a service category." },
  { name: "service_category_delete", description: "Deactivate a service category." },

  // Products
  { name: "product_view", description: "View retail products available for sale." },
  { name: "product_create", description: "Add a new product with price, cost, and stock info." },
  { name: "product_edit", description: "Update product details (price, stock level, supplier, etc.)." },
  { name: "product_delete", description: "Deactivate or discontinue a product." },

  // Product Categories
  { name: "product_category_view", description: "View product groupings (e.g., Shampoo, Tools, Accessories)." },
  { name: "product_category_create", description: "Create a new product category." },
  { name: "product_category_edit", description: "Edit a product category name or description." },
  { name: "product_category_delete", description: "Deactivate a product category." },

  // Supplies (non-sale inventory like bleach, towels)
  { name: "supply_view", description: "View salon supply inventory (e.g., chemicals, tools)." },
  { name: "supply_create", description: "Add a new supply item to inventory." },
  { name: "supply_edit", description: "Update supply details (quantity, cost, reorder level)." },
  { name: "supply_delete", description: "Deactivate or remove a supply item." },

  // Inventory Adjustments (Products & Supplies)
  { name: "inventory_adjustment_view", description: "View logs of stock adjustments (losses, corrections, etc.)." },
  { name: "inventory_adjustment_create", description: "Record a manual adjustment to product or supply stock." },
  // Note: Edits/deletes of adjustments are typically not allowed for audit integrity

  // Transactions & Sales
  { name: "transaction_view", description: "View all sales, payments, and receipts." },
  { name: "transaction_create", description: "Process a new sale (services, products, booking fees)." },
  { name: "transaction_edit", description: "Modify a transaction (e.g., add tip, apply discount)." },
  { name: "transaction_delete", description: "Void or refund a transaction (soft delete)." },

  // Discounts
  { name: "discount_view", description: "View available discount types and rules." },
  { name: "discount_create", description: "Create a new discount (fixed amount or percentage)." },
  { name: "discount_edit", description: "Update discount name, value, or conditions." },
  { name: "discount_delete", description: "Deactivate a discount." },

  // Payment Methods
  { name: "payment_method_view", description: "View accepted payment methods (cash, card, etc.)." },
  { name: "payment_method_create", description: "Add a new payment method option." },
  { name: "payment_method_edit", description: "Update payment method details." },
  { name: "payment_method_delete", description: "Deactivate a payment method." },

  // Staff Management
  { name: "staff_view", description: "View staff profiles, contact info, and employment details." },
  { name: "staff_create", description: "Hire and onboard a new staff member." },
  { name: "staff_edit", description: "Update staff details (contact, position, status, etc.)." },
  { name: "staff_delete", description: "Terminate or deactivate a staff member (soft delete)." },

  // Staff Contacts
  { name: "staff_contact_view", description: "View staff alternate contact methods." },
  { name: "staff_contact_create", description: "Add new contact info for a staff member." },
  { name: "staff_contact_edit", description: "Update staff contact details." },
  { name: "staff_contact_delete", description: "Remove a staff contact method." },

  // Staff Accounts (e.g., bank info for payroll)
  { name: "staff_account_view", description: "View staff payment account details." },
  { name: "staff_account_create", description: "Add a payment account for a staff member." },
  { name: "staff_account_edit", description: "Update staff account information." },
  { name: "staff_account_delete", description: "Remove a staff payment account." },

  // Staff Schedule
  { name: "staff_schedule_view", description: "View staff working hours and shifts." },
  { name: "staff_schedule_create", description: "Assign a new shift or working day for staff." },
  { name: "staff_schedule_edit", description: "Modify an existing staff shift." },
  { name: "staff_schedule_delete", description: "Remove a scheduled shift." },

  // Staff Services (which services a staff member can perform)
  { name: "staff_service_view", description: "See which services each staff member is assigned to." },
  { name: "staff_service_create", description: "Assign a service to a staff member." },
  { name: "staff_service_edit", description: "Reassign or update staff-service mappings." },
  { name: "staff_service_delete", description: "Remove a service assignment from a staff member." },

  // Staff Types & Positions
  { name: "staff_type_view", description: "View staff type definitions (e.g., Stylist, Receptionist)." },
  { name: "staff_type_create", description: "Create a new staff type." },
  { name: "staff_type_edit", description: "Update a staff type." },
  { name: "staff_type_delete", description: "Deactivate a staff type." },

  { name: "position_view", description: "View job positions (e.g., Senior Stylist, Manager)." },
  { name: "position_create", description: "Add a new job position." },
  { name: "position_edit", description: "Update position details." },
  { name: "position_delete", description: "Deactivate a position." },

  // Payroll & Compensation
  { name: "payroll_run_view", description: "View payroll processing history and summaries." },
  { name: "payroll_run_create", description: "Initiate a new payroll run for staff." },
  { name: "payroll_run_edit", description: "Adjust payroll before finalizing (rarely allowed)." },
  { name: "payroll_run_delete", description: "Cancel or void a payroll run." },

  { name: "payroll_entry_view", description: "View individual staff payroll records." },
  // Typically, entries are auto-generated; manual create/edit/delete may be restricted

  { name: "salary_view", description: "View staff base salary records." },
  { name: "salary_create", description: "Set or update a staff member’s base salary." },
  { name: "salary_edit", description: "Modify an existing salary record." },
  { name: "salary_delete", description: "End or deactivate a salary period." },

  { name: "bonus_view", description: "View awarded bonuses." },
  { name: "bonus_create", description: "Award a one-time bonus to staff." },
  { name: "bonus_edit", description: "Correct a bonus entry." },
  { name: "bonus_delete", description: "Revoke or void a bonus." },

  { name: "overtime_view", description: "View overtime records for staff." },
  { name: "overtime_create", description: "Log approved overtime hours." },
  { name: "overtime_edit", description: "Adjust overtime hours or pay rate." },
  { name: "overtime_delete", description: "Remove an overtime entry." },

  { name: "deduction_view", description: "View payroll deductions (taxes, penalties, etc.)." },
  { name: "deduction_create", description: "Add a new deduction for a staff member." },
  { name: "deduction_edit", description: "Update a deduction amount or type." },
  { name: "deduction_delete", description: "Remove a deduction." },

  // Commissions
  { name: "commission_view", description: "View commission earnings from services and products." },
  // Commissions are usually auto-generated; manual actions may be limited

  // Expenses
  { name: "expense_view", description: "View business expense records." },
  { name: "expense_create", description: "Log a new business expense." },
  { name: "expense_edit", description: "Correct an expense entry." },
  { name: "expense_delete", description: "Void or remove an expense record." },

  // Expense Types
  { name: "expense_type_view", description: "View categories of expenses (e.g., Rent, Utilities)." },
  { name: "expense_type_create", description: "Add a new expense type." },
  { name: "expense_type_edit", description: "Update an expense type." },
  { name: "expense_type_delete", description: "Deactivate an expense type." },

  // Audit & Reporting
  { name: "audit_log_view", description: "View daily operational summaries (appointments, sales, staff activity)." },
  // Audit logs are typically read-only

  // User & Role Management
  { name: "user_view", description: "View system user accounts." },
  { name: "user_create", description: "Create a new user account." },
  { name: "user_edit", description: "Update user details (email, role, branch, etc.)." },
  { name: "user_delete", description: "Deactivate a user account." },

  { name: "role_view", description: "View available user roles (Admin, Manager, etc.)." },
  { name: "role_create", description: "Create a new role." },
  { name: "role_edit", description: "Update role permissions or description." },
  { name: "role_delete", description: "Deactivate a role." },

  { name: "permission_manage", description: "Assign or revoke permissions for roles or users." }
];

const existingBranches = await db.select().from(branches).limit(1);
  if (existingBranches.length === 0){
     await db.insert(branches).values({name: "Main Branch"});
  }

  const [branch] = await db.select({id: branches.id}).from(branches).where(eq(branches.name, "Main Branch"));
 
 
const existingPermissions = await db
  .select()
  .from(permissions)
  .limit(1);

if (existingPermissions.length === 0) {
  await db.insert(permissions).values(
    permissionData.map((p) => ({
      name: p.name,
      description: p.description,
    }))
  );
}  
     const name = "System Admin";
     const description = "Can do Everything"

  /* ---------- 2. Admin role ---------- */
  const adminRole = await db
    .select()
    .from(roles)
    .limit(1); 
   
  if (adminRole.length === 0) {
     await db.insert(roles).values({ name, description });
  } 

   const [role] = await db.select({id: roles.id}).from(roles).where(eq(roles.name, "System Admin"))



  /* ---------- 3. Role-Permission links ---------- */
  const allPerms = await db.select({id: permissions.id}).from(permissions);

  await db.insert(rolePermissions).values(
           allPerms.map((p) => ({
            roleId: role.id,
            permissionId: p.id,
            branchId: branch.id
          }))
        );
  /* ---------- 4. Admin user ---------- */
   

   const adminName = "admin";
   const email = "admin@nahu.com";
   const password= "SystemAdmin123"
   const username = extractUsername(email);
  
  
  const passwordHash = await hash(password, {
              // recommended minimum parameters
              memoryCost: 19456,
              timeCost: 2,
              outputLen: 32,
              parallelism: 1
          });
     const id = generateUserId()

    await db.insert(user).values({ id, username, name: adminName, email, roleId: role.id, passwordHash, branchId: 1});
     
  
        }
  


seed()
  .then(() => {
    console.log('✅ DB seeded');
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Seeding failed', e);
    process.exit(1);
  });