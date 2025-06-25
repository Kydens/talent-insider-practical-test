const { Users } = require('.');

const seedInitialData = async () => {
  try {
    const adminExists = await Users.findOne({
      where: { email: 'admin@admin.com' },
    });
    if (!adminExists) {
      await Users.create({
        first_name: 'admin',
        last_name: '123',
        email: 'admin@admin.com',
        password:
          '$2b$10$pZUF0ON1a9aOxn0XijziEuoxocwfJlhCCdTn/tydoUMvrafKdlrbS', // Password secret123!@#
        role: 'Admin',
        about: null,
        isActive: true,
        created_at: new Date(),
      });
      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error seeding initial data: ', err.message);
  }
};

module.exports = seedInitialData;
