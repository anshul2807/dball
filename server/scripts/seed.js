const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding.');

    // Clear existing collections
    console.log('Clearing old data...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    // 1. Create Admin User
    console.log('Creating Admin user...');
    const admin = await User.create({
      name: 'Rishab Sarvaria (D-Ball Admin)',
      email: 'schooldball@gmail.com',
      password: 'admin123',
      role: 'Admin',
      phone: '9810001399',
      college: 'Delhi University Alumni',
    });

    // Also secondary admin as in PPT
    await User.create({
      name: 'Shamshul (D-Ball Admin)',
      email: 'dballleague@gmail.com',
      password: 'admin123',
      role: 'Admin',
      phone: '9999192193',
      college: 'Delhi University Alumni',
    });

    // 2. Create Normal Users (Players)
    console.log('Creating sample Normal Users...');
    const player1 = await User.create({
      name: 'Aarav Mehta',
      email: 'player@dball.com',
      password: 'player123',
      role: 'NormalUser',
      phone: '9876543210',
      college: 'Hindu College, Delhi University',
    });

    const player2 = await User.create({
      name: 'Rohan Deshmukh',
      email: 'rohan@gmail.com',
      password: 'player123',
      role: 'NormalUser',
      phone: '9811223344',
      college: 'Hansraj College, DU',
    });

    const player3 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      password: 'player123',
      role: 'NormalUser',
      phone: '9711882233',
      college: 'Lady Shri Ram College',
    });

    // 3. Create Events from PPT
    console.log('Creating Events...');
    const event1 = await Event.create({
      title: 'D-BALL Pan-City Championship Season 4',
      subtitle: 'Delhi Pan-City Collegiate League - 12+ Colleges Competing',
      description:
        "Season 4 of India's fastest-growing collegiate basketball revolution! From a small dream in Delhi University to one of India's most anticipated collegiate leagues, D-BALL brings together top college basketball squads across Delhi for high-octane 5v5 knockout battles. Featuring live commentary, dynamic fan zones, high-tempo beats, and national scouting scouts.",
      category: 'Pan-City League',
      date: new Date('2026-11-15T10:00:00.000Z'),
      time: '09:00 AM - 08:00 PM',
      venue: 'Delhi University Sports Complex Indoor Stadium',
      location: 'North Campus, Delhi University, New Delhi',
      entryFee: 0,
      prizePool: '₹2,50,000 + Championship Trophy & Scouting Fast-Track',
      maxParticipants: 16,
      registeredCount: 2,
      teamType: 'Team (5v5)',
      minTeamMembers: 5,
      maxTeamMembers: 12,
      rules: [
        'Official FIBA 5v5 basketball rules apply.',
        'Four quarters of 10 minutes stop-clock format.',
        'All players must present a valid college ID and sports declaration before tip-off.',
        'Matching jerseys with clear jersey numbers are mandatory for all team members.',
        '24-second shot clock and 8-second frontcourt rule will be strictly managed.',
        'Zero-tolerance policy for unsportsmanlike behavior, foul language, or fighting.',
      ],
      eligibility:
        'Open to full-time enrolled students from recognized universities and colleges in Delhi-NCR (Ages 16-28).',
      bannerImage:
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      isFeatured: true,
      createdBy: admin._id,
    });

    const event2 = await Event.create({
      title: 'D-BALL All-Star Weekend & Slam Dunk Contest',
      subtitle: 'Where Passion Meets Power - High-Flying Dunkers & Live Beats',
      description:
        "Step into the spotlight at the D-BALL All-Star Weekend! Gravity-defying dunkers and trick-shot creators showcase athletic excellence. Judged by former DU international basketball luminaries and judged on creativity, difficulty, and crowd hype. Music, dance crews, and creator booths run all evening.",
      category: 'Slam Dunk Contest',
      date: new Date('2026-11-22T16:00:00.000Z'),
      time: '04:00 PM - 09:30 PM',
      venue: 'Hindu College Basketball Arena',
      location: 'University Enclave, Delhi',
      entryFee: 0,
      prizePool: '₹75,000 + Custom Ring & Sneaker Sponsorship',
      maxParticipants: 16,
      registeredCount: 1,
      teamType: 'Solo Participant',
      minTeamMembers: 1,
      maxTeamMembers: 1,
      rules: [
        'Round 1: Each participant gets 2 attempts to register their best dunk.',
        'Judges score each dunk from 1 to 10 across power, elevation, and style.',
        'Top 4 dunkers advance to the Final Showdown with 90 seconds of creative freedom.',
        'Props and teammate lob passes are allowed with prior notification.',
      ],
      eligibility: 'Open to college dunkers and registered youth basketball athletes.',
      bannerImage:
        'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      isFeatured: true,
      createdBy: admin._id,
    });

    const event3 = await Event.create({
      title: 'Delhi 3-Point Snipers Shootout 2026',
      subtitle: '60 Seconds. 5 Racks. Precision Perimeter Shooting.',
      description:
        'Think you have the deadliest jumper in Delhi? The 3-Point Snipers Shootout brings together pure shooters from across 20+ colleges. Test your speed, release, and clutch shooting under pressure with the 2-point Money Ball on the line!',
      category: '3-Point Battle',
      date: new Date('2026-11-29T14:00:00.000Z'),
      time: '02:00 PM - 07:00 PM',
      venue: 'Hansraj College Basketball Courts',
      location: 'Malka Ganj, North Campus, Delhi',
      entryFee: 0,
      prizePool: '₹50,000 + Sniper Gold Trophy',
      maxParticipants: 32,
      registeredCount: 0,
      teamType: 'Solo Participant',
      minTeamMembers: 1,
      maxTeamMembers: 1,
      rules: [
        '5 racks of 5 balls placed around the FIBA three-point line.',
        'Total 70 seconds on the countdown timer.',
        'Standard orange balls count for 1 point; the final money ball on each rack counts for 2 points.',
        'Highest aggregate scores advance to the championship bracket.',
      ],
      eligibility: 'Open to all enrolled students and aspiring shooters.',
      bannerImage:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      isFeatured: true,
      createdBy: admin._id,
    });

    const event4 = await Event.create({
      title: 'Basketball For All - Youth Grassroots Camp',
      subtitle: 'Free Professional Coaching & Mentorship For Underprivileged Kids',
      description:
        "In alignment with D-BALL's mission of giving basketball a real home in India, 'Basketball For All' provides free structured training, fitness conditioning, and life mentorship sessions for underprivileged youth. Led by Sunita Sarvaria and DU alumni international coaches.",
      category: 'Grassroots Camp',
      date: new Date('2026-12-06T09:00:00.000Z'),
      time: '09:00 AM - 01:00 PM',
      venue: 'Chhatrasal Stadium Sports Enclave',
      location: 'Model Town, New Delhi',
      entryFee: 0,
      prizePool: 'Free Training Kits, Basketballs & Merit Scholarships',
      maxParticipants: 50,
      registeredCount: 0,
      teamType: 'Solo Participant',
      minTeamMembers: 1,
      maxTeamMembers: 1,
      rules: [
        'Free attendance for all registered kids and youth.',
        'Includes complimentary training t-shirt, water bottle, and basketball kit.',
        'Sessions cover fundamentals: dribbling, footwork, passing, defense, and discipline.',
      ],
      eligibility: 'Ages 10-18 boys and girls from all backgrounds.',
      bannerImage:
        'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      isFeatured: false,
      createdBy: admin._id,
    });

    const event5 = await Event.create({
      title: "Inter-College Women's Basketball Showcase",
      subtitle: "Celebrating India's Rising Women Basketball Stars",
      description:
        "A marquee tournament dedicated to elevating collegiate women's basketball. Featuring fierce competition from powerhouse teams across Delhi University and North India with scouts and national sports media presence.",
      category: 'Inter-College Championship',
      date: new Date('2026-12-14T10:00:00.000Z'),
      time: '10:00 AM - 06:00 PM',
      venue: 'Miranda House Basketball Arena',
      location: 'Patel Chest, Delhi University, Delhi',
      entryFee: 0,
      prizePool: '₹1,50,000 + MVP Honors & Scholarships',
      maxParticipants: 12,
      registeredCount: 0,
      teamType: 'Team (5v5)',
      minTeamMembers: 5,
      maxTeamMembers: 12,
      rules: [
        'Full 5v5 FIBA collegiate tournament regulations.',
        'Group stage followed by semifinals and Grand Finale.',
        'Medals and player kit bags for all participating teams.',
      ],
      eligibility: "Open to recognized Women's college teams.",
      bannerImage:
        'https://images.unsplash.com/photo-1544919982-b61976f0ba43?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      isFeatured: false,
      createdBy: admin._id,
    });

    // 4. Create sample registrations so admin and user can see them immediately
    console.log('Creating sample Registrations...');
    await Registration.create({
      event: event1._id,
      user: player1._id,
      teamName: 'Hindu Hawks',
      captainName: 'Aarav Mehta',
      collegeName: 'Hindu College, Delhi University',
      contactPhone: '9876543210',
      contactEmail: 'player@dball.com',
      teamMembers: [
        { name: 'Aarav Mehta', jerseyNumber: '7', position: 'Point Guard', phone: '9876543210' },
        { name: 'Kabir Varma', jerseyNumber: '23', position: 'Shooting Guard', phone: '9876543211' },
        { name: 'Vikram Sen', jerseyNumber: '11', position: 'Small Forward', phone: '9876543212' },
        { name: 'Sameer Khan', jerseyNumber: '34', position: 'Power Forward', phone: '9876543213' },
        { name: 'Dev Sharma', jerseyNumber: '15', position: 'Center', phone: '9876543214' },
      ],
      notes: 'Ready to defend the North Campus turf! Season 3 semifinalists.',
      ticketCode: 'DBALL-2026-HWK01-1024',
      status: 'confirmed',
    });

    await Registration.create({
      event: event1._id,
      user: player2._id,
      teamName: 'Hansraj Hoopers',
      captainName: 'Rohan Deshmukh',
      collegeName: 'Hansraj College, DU',
      contactPhone: '9811223344',
      contactEmail: 'rohan@gmail.com',
      teamMembers: [
        { name: 'Rohan Deshmukh', jerseyNumber: '3', position: 'Point Guard', phone: '9811223344' },
        { name: 'Ayush Goel', jerseyNumber: '8', position: 'Shooting Guard', phone: '9811223345' },
        { name: 'Taran Singh', jerseyNumber: '24', position: 'Small Forward', phone: '9811223346' },
        { name: 'Neeraj Rawat', jerseyNumber: '33', position: 'Power Forward', phone: '9811223347' },
        { name: 'Harshit Malik', jerseyNumber: '99', position: 'Center', phone: '9811223348' },
      ],
      notes: 'New squad ready for season 4 debut.',
      ticketCode: 'DBALL-2026-HNS02-3921',
      status: 'confirmed',
    });

    await Registration.create({
      event: event2._id,
      user: player1._id,
      teamName: 'Aarav "Air" Mehta',
      captainName: 'Aarav Mehta',
      collegeName: 'Hindu College, DU',
      contactPhone: '9876543210',
      contactEmail: 'player@dball.com',
      teamMembers: [
        { name: 'Aarav Mehta', jerseyNumber: '7', position: 'Guard/Dunker', phone: '9876543210' },
      ],
      notes: 'Bringing 360 windmill and between the legs dunks.',
      ticketCode: 'DBALL-2026-DNK07-8821',
      status: 'confirmed',
    });

    console.log('Database seeded successfully!');
    console.log('\n--- CREDENTIALS ---');
    console.log('Admin:');
    console.log('  Email:    schooldball@gmail.com');
    console.log('  Password: admin123');
    console.log('Normal User:');
    console.log('  Email:    player@dball.com');
    console.log('  Password: player123');
    console.log('-------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
