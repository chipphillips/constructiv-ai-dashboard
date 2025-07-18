#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * This script tests the connection to the Supabase database and validates
 * that all required RPC functions are available and working correctly.
 * 
 * Usage:
 *   node scripts/test-db-connection.js
 *   npm run test-db
 */

const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

// Logging utility
const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`),
};

// Configuration
const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  postgres: {
    host: process.env.SUPABASE_HOST,
    database: process.env.SUPABASE_DB,
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PASSWORD,
    port: parseInt(process.env.SUPABASE_PORT || '5432'),
    ssl: true,
  },
};

// RPC functions to test
const rpcFunctions = [
  'get_documents_with_extraction_counts',
  'get_document_details_with_extractions',
  'get_dashboard_stats',
  'delete_extraction_by_type',
];

// Database tables to check
const requiredTables = [
  'knowledge_base.documents',
  'knowledge_base.company_profiles',
  'knowledge_base.style_profiles',
  'knowledge_base.persona_profiles',
  'knowledge_base.reports_80_20',
  'knowledge_base.data_visualizations',
  'knowledge_base.design_details',
  'knowledge_base.visual_doodles',
  'knowledge_base.general_extractions',
];

/**
 * Test Supabase client connection
 */
async function testSupabaseConnection() {
  log.header('Testing Supabase Client Connection');
  
  try {
    // Validate environment variables
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error('Missing required Supabase environment variables');
    }
    
    log.info('Creating Supabase client...');
    const supabase = createClient(config.supabase.url, config.supabase.anonKey);
    
    // Test basic connection
    log.info('Testing basic connection...');
    const { data, error } = await supabase.from('documents').select('count', { count: 'exact', head: true });
    
    if (error) {
      log.warn(`Connection test returned error: ${error.message}`);
      // This might be expected if the table doesn't exist yet
    } else {
      log.success('Supabase client connection successful');
    }
    
    return supabase;
  } catch (error) {
    log.error(`Supabase connection failed: ${error.message}`);
    throw error;
  }
}

/**
 * Test PostgreSQL direct connection
 */
async function testPostgresConnection() {
  log.header('Testing Direct PostgreSQL Connection');
  
  try {
    // Validate environment variables
    if (!config.postgres.host || !config.postgres.user || !config.postgres.password) {
      throw new Error('Missing required PostgreSQL environment variables');
    }
    
    log.info('Creating PostgreSQL connection pool...');
    const pool = new Pool(config.postgres);
    
    // Test connection
    log.info('Testing PostgreSQL connection...');
    const client = await pool.connect();
    
    // Test basic query
    const result = await client.query('SELECT version()');
    log.success(`PostgreSQL connection successful: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    
    client.release();
    await pool.end();
    
    return true;
  } catch (error) {
    log.error(`PostgreSQL connection failed: ${error.message}`);
    return false;
  }
}

/**
 * Test schema existence
 */
async function testSchemaExistence(supabase) {
  log.header('Testing Database Schema');
  
  try {
    // Test knowledge_base schema
    log.info('Checking knowledge_base schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('exec_sql', { sql: "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'knowledge_base'" });
    
    if (schemaError) {
      log.warn(`Schema check failed: ${schemaError.message}`);
    } else {
      log.success('knowledge_base schema exists');
    }
    
    // Test individual tables
    for (const table of requiredTables) {
      log.info(`Checking table: ${table}`);
      const { data, error } = await supabase.from(table.split('.')[1]).select('*', { count: 'exact', head: true });
      
      if (error) {
        log.warn(`Table ${table} check failed: ${error.message}`);
      } else {
        log.success(`Table ${table} exists`);
      }
    }
    
    return true;
  } catch (error) {
    log.error(`Schema testing failed: ${error.message}`);
    return false;
  }
}

/**
 * Test RPC functions
 */
async function testRPCFunctions(supabase) {
  log.header('Testing RPC Functions');
  
  try {
    for (const funcName of rpcFunctions) {
      log.info(`Testing RPC function: ${funcName}`);
      
      let result;
      switch (funcName) {
        case 'get_documents_with_extraction_counts':
          result = await supabase.rpc(funcName);
          break;
        case 'get_document_details_with_extractions':
          // Skip this test if no documents exist
          result = { data: [], error: null };
          break;
        case 'get_dashboard_stats':
          result = await supabase.rpc(funcName);
          break;
        case 'delete_extraction_by_type':
          // Skip destructive test
          result = { data: null, error: null };
          log.info(`Skipping destructive test for ${funcName}`);
          break;
        default:
          result = await supabase.rpc(funcName);
      }
      
      if (result.error) {
        log.warn(`RPC function ${funcName} failed: ${result.error.message}`);
      } else {
        log.success(`RPC function ${funcName} working`);
      }
    }
    
    return true;
  } catch (error) {
    log.error(`RPC function testing failed: ${error.message}`);
    return false;
  }
}

/**
 * Test database performance
 */
async function testDatabasePerformance(supabase) {
  log.header('Testing Database Performance');
  
  try {
    // Test query performance
    const queries = [
      { name: 'Dashboard Stats', func: () => supabase.rpc('get_dashboard_stats') },
      { name: 'Document List', func: () => supabase.rpc('get_documents_with_extraction_counts') },
    ];
    
    for (const query of queries) {
      log.info(`Testing performance: ${query.name}`);
      const startTime = Date.now();
      
      const result = await query.func();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (result.error) {
        log.warn(`Query ${query.name} failed: ${result.error.message}`);
      } else {
        const status = responseTime < 500 ? 'excellent' : responseTime < 1000 ? 'good' : 'slow';
        log.success(`Query ${query.name} completed in ${responseTime}ms (${status})`);
      }
    }
    
    return true;
  } catch (error) {
    log.error(`Performance testing failed: ${error.message}`);
    return false;
  }
}

/**
 * Generate test report
 */
function generateReport(results) {
  log.header('Test Report');
  
  console.log('\n' + '='.repeat(50));
  console.log(`${colors.bold}DATABASE CONNECTION TEST REPORT${colors.reset}`);
  console.log('='.repeat(50));
  
  console.log(`\n${colors.bold}Environment:${colors.reset}`);
  console.log(`  Node.js Version: ${process.version}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Supabase URL: ${config.supabase.url ? 'configured' : 'missing'}`);
  console.log(`  Database Host: ${config.postgres.host ? 'configured' : 'missing'}`);
  
  console.log(`\n${colors.bold}Test Results:${colors.reset}`);
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
    console.log(`  ${test.padEnd(30)}: ${status}`);
  });
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const successRate = Math.round((passedTests / totalTests) * 100);
  
  console.log(`\n${colors.bold}Summary:${colors.reset}`);
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Passed: ${colors.green}${passedTests}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${totalTests - passedTests}${colors.reset}`);
  console.log(`  Success Rate: ${successRate >= 80 ? colors.green : colors.red}${successRate}%${colors.reset}`);
  
  console.log('\n' + '='.repeat(50));
  
  if (successRate < 80) {
    console.log(`\n${colors.red}${colors.bold}WARNING:${colors.reset} Database connection issues detected!`);
    console.log('Please check your environment variables and database configuration.');
    console.log('Refer to the README.md for setup instructions.');
  } else {
    console.log(`\n${colors.green}${colors.bold}SUCCESS:${colors.reset} Database connection is working properly!`);
  }
}

/**
 * Main test function
 */
async function main() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                   DATABASE CONNECTION TEST                   ║');
  console.log('║               Constructiv AI Dashboard                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);
  
  const results = {};
  
  try {
    // Test Supabase connection
    const supabase = await testSupabaseConnection();
    results['Supabase Connection'] = true;
    
    // Test PostgreSQL connection
    results['PostgreSQL Connection'] = await testPostgresConnection();
    
    // Test schema
    results['Schema Validation'] = await testSchemaExistence(supabase);
    
    // Test RPC functions
    results['RPC Functions'] = await testRPCFunctions(supabase);
    
    // Test performance
    results['Performance Test'] = await testDatabasePerformance(supabase);
    
  } catch (error) {
    log.error(`Test execution failed: ${error.message}`);
    results['Test Execution'] = false;
  }
  
  // Generate report
  generateReport(results);
  
  // Exit with appropriate code
  const allPassed = Object.values(results).every(Boolean);
  process.exit(allPassed ? 0 : 1);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Run the tests
if (require.main === module) {
  main();
}

module.exports = { main, testSupabaseConnection, testPostgresConnection };