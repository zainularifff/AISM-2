/**
 * Database Configuration for Partners, Projects, and Clients
 * Maps the organizational hierarchy to database connections
 */

// Example configuration - In production, this should be loaded from a central database
const config = {
    partners: [{
            id: 'PARTNER_001',
            name: 'Partner A',
            email: 'admin@partnera.com',
            projects: ['FGV', 'RISDA'],
            dbConnections: [{
                    id: 'db_hardware_software',
                    type: 'postgresql',
                    name: 'Hardware & Software Database',
                    host: 'partner-a-db.example.com',
                    port: 5432,
                    database: 'leasing_hw_sw',
                    username: process.env.DB_USER_PARTNER_A || 'partner_a_user',
                    password: process.env.DB_PASS_PARTNER_A || 'password123'
                },
                {
                    id: 'db_helpdesk',
                    type: 'mysql',
                    name: 'Helpdesk Database',
                    host: 'partner-a-helpdesk.example.com',
                    port: 3306,
                    database: 'helpdesk',
                    username: process.env.DB_USER_HELPDESK || 'helpdesk_user',
                    password: process.env.DB_PASS_HELPDESK || 'password123'
                },
                {
                    id: 'db_crm',
                    type: 'postgresql',
                    name: 'CRM Database',
                    host: 'partner-a-crm.example.com',
                    port: 5432,
                    database: 'crm_data',
                    username: process.env.DB_USER_CRM || 'crm_user',
                    password: process.env.DB_PASS_CRM || 'password123'
                }
            ]
        },
        {
            id: 'PARTNER_002',
            name: 'Partner B',
            email: 'admin@partnerb.com',
            projects: ['PROJECT_X', 'PROJECT_Y'],
            dbConnections: [{
                id: 'db_hardware_software',
                type: 'mysql',
                name: 'Hardware & Software Database',
                host: 'partner-b-db.example.com',
                port: 3306,
                database: 'leasing_hw_sw',
                username: process.env.DB_USER_PARTNER_B || 'partner_b_user',
                password: process.env.DB_PASS_PARTNER_B || 'password123'
            }]
        }
    ],

    projects: {
        FGV: {
            id: 'FGV',
            name: 'FGV Project',
            partnerId: 'PARTNER_001',
            clients: ['KWSP', 'JPJ', 'PERKESO'],
            description: 'FGV Leasing Project',
            dbConnections: ['db_hardware_software', 'db_helpdesk', 'db_crm']
        },
        RISDA: {
            id: 'RISDA',
            name: 'RISDA Project',
            partnerId: 'PARTNER_001',
            clients: ['RISDA_CLIENT_1', 'RISDA_CLIENT_2'],
            description: 'RISDA Leasing Project',
            dbConnections: ['db_hardware_software', 'db_helpdesk', 'db_crm']
        },
        PROJECT_X: {
            id: 'PROJECT_X',
            name: 'Project X',
            partnerId: 'PARTNER_002',
            clients: ['CLIENT_X1', 'CLIENT_X2'],
            description: 'Project X',
            dbConnections: ['db_hardware_software']
        },
        PROJECT_Y: {
            id: 'PROJECT_Y',
            name: 'Project Y',
            partnerId: 'PARTNER_002',
            clients: ['CLIENT_Y1'],
            description: 'Project Y',
            dbConnections: ['db_hardware_software']
        }
    },

    clients: {
        KWSP: {
            id: 'KWSP',
            name: 'Kumpulan Wang Simpanan Pekerja',
            projectId: 'FGV',
            status: 'active'
        },
        JPJ: {
            id: 'JPJ',
            name: 'Jabatan Pengangkutan Jalan',
            projectId: 'FGV',
            status: 'active'
        },
        PERKESO: {
            id: 'PERKESO',
            name: 'Pertubuhan Keselamatan Sosial',
            projectId: 'FGV',
            status: 'active'
        },
        RISDA_CLIENT_1: {
            id: 'RISDA_CLIENT_1',
            name: 'RISDA Client 1',
            projectId: 'RISDA',
            status: 'active'
        },
        RISDA_CLIENT_2: {
            id: 'RISDA_CLIENT_2',
            name: 'RISDA Client 2',
            projectId: 'RISDA',
            status: 'active'
        },
        CLIENT_X1: {
            id: 'CLIENT_X1',
            name: 'Client X1',
            projectId: 'PROJECT_X',
            status: 'active'
        },
        CLIENT_X2: {
            id: 'CLIENT_X2',
            name: 'Client X2',
            projectId: 'PROJECT_X',
            status: 'active'
        },
        CLIENT_Y1: {
            id: 'CLIENT_Y1',
            name: 'Client Y1',
            projectId: 'PROJECT_Y',
            status: 'active'
        }
    }
};

module.exports = config;