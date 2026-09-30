import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CampusConnect database seed...');

  // Clean existing tables
  await prisma.feedback.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.club.deleteMany();
  await prisma.auditLog.deleteMany();

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Campus Admin',
      email: 'admin@campusconnect.edu',
      passwordHash: 'admin123', // Demo credentials
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`✅ Admin created: ${adminUser.email}`);

  // Create Clubs
  const clubsData = [
    {
      name: 'Coding Society',
      slug: 'coding-society',
      category: 'Technical',
      description: 'The premier developer community on campus. We host hackathons, competitive programming contests, open-source sprints, and peer learning sessions.',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      contactEmail: 'codingsociety@campusconnect.edu',
      github: 'https://github.com/campus-coding-soc',
      instagram: 'https://instagram.com/campus_coders',
      isFeatured: true,
    },
    {
      name: 'AI & Robotics Club',
      slug: 'ai-robotics-club',
      category: 'Innovation & AI',
      description: 'Exploring machine learning, deep learning, computer vision, autonomous systems, and hardware robotics. Join us to build futuristic AI projects.',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      contactEmail: 'airobotics@campusconnect.edu',
      github: 'https://github.com/campus-airobotics',
      isFeatured: true,
    },
    {
      name: 'Cybersecurity Guild',
      slug: 'cybersecurity-guild',
      category: 'Security & Systems',
      description: 'Defending networks, cracking CTFs, analyzing malware, and mastering ethical hacking. Learn offensive and defensive security from scratch.',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      contactEmail: 'cybersec@campusconnect.edu',
      isFeatured: false,
    },
    {
      name: 'Design & UI/UX Society',
      slug: 'design-society',
      category: 'Creative & Design',
      description: 'Transforming ideas into visually stunning and user-friendly digital experiences. Workshops in Figma, design systems, animation, and brand design.',
      logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=1200&auto=format&fit=crop&q=80',
      contactEmail: 'design@campusconnect.edu',
      instagram: 'https://instagram.com/campus_designers',
      isFeatured: true,
    },
    {
      name: 'E-Cell (Entrepreneurship Cell)',
      slug: 'e-cell',
      category: 'Business & Startup',
      description: 'Fostering startup culture, pitch competitions, founder talks, venture capital networking, and product management bootcamps.',
      logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80',
      contactEmail: 'ecell@campusconnect.edu',
      linkedin: 'https://linkedin.com/company/campus-ecell',
      isFeatured: false,
    },
    {
      name: 'Astronomy & Space Club',
      slug: 'astronomy-club',
      category: 'Science & Research',
      description: 'Stargazing nights, telescope workshops, astrophysics discussions, space mission analysis, and satellite engineering initiatives.',
      logo: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=300&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      contactEmail: 'astro@campusconnect.edu',
      isFeatured: false,
    },
  ];

  const clubs = [];
  for (const c of clubsData) {
    const club = await prisma.club.create({ data: c });
    clubs.push(club);
  }
  console.log(`✅ Created ${clubs.length} clubs`);

  const codingClub = clubs.find((c) => c.slug === 'coding-society')!;
  const aiClub = clubs.find((c) => c.slug === 'ai-robotics-club')!;
  const cyberClub = clubs.find((c) => c.slug === 'cybersecurity-guild')!;
  const designClub = clubs.find((c) => c.slug === 'design-society')!;
  const eCell = clubs.find((c) => c.slug === 'e-cell')!;
  const astroClub = clubs.find((c) => c.slug === 'astronomy-club')!;

  // Current year dates for realistic data
  const now = new Date();
  const futureDate1 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days in future
  const futureDate2 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in future
  const futureDate3 = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000); // 12 days in future
  const futureDate4 = new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000); // 18 days in future
  const todayDate = new Date(now.getTime() + 4 * 60 * 60 * 1000); // Today later
  const pastDate1 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
  const pastDate2 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days ago

  const eventsData = [
    {
      clubId: codingClub.id,
      title: 'CodeSprint 2026: 24-Hour Campus Hackathon',
      slug: 'codesprint-2026',
      shortDescription: 'Build high-impact web and mobile solutions in 24 hours with mentorship, free food, and \$5000 in prizes!',
      description: 'CodeSprint 2026 is the biggest inter-collegiate hackathon on campus! Gather your team of 2-4 students or compete solo. Participants will get access to API workshops, cloud credits, industry judges, and hands-on guidance from senior engineers. Tracks include AI & Intelligent Apps, FinTech, EdTech, and Open Innovation.',
      category: 'Hackathon',
      date: futureDate1,
      startTime: '10:00 AM',
      endTime: '10:00 AM (+1 Day)',
      venue: 'Main CS Auditorium & Lab 1',
      venueBuilding: 'Computer Science Block',
      venueRoom: 'Auditorium A',
      venueFloor: 'Ground Floor',
      organizerName: 'Alex Rivera (President, Coding Soc)',
      organizerEmail: 'alex.rivera@campusconnect.edu',
      capacity: 120,
      registrationDeadline: new Date(futureDate1.getTime() - 24 * 60 * 60 * 1000),
      status: 'REGISTRATION_OPEN',
      featured: true,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Hackathon', 'Coding', 'Web', 'Prizes']),
    },
    {
      clubId: aiClub.id,
      title: 'AI Buildathon: Hands-on Generative AI & Agents Workshop',
      slug: 'ai-buildathon-workshop',
      shortDescription: 'Master LLM orchestration, RAG pipelines, and agentic tools using Python and modern AI SDKs.',
      description: 'In this intensive 4-hour workshop, you will build and deploy a functional autonomous AI agent from scratch. Learn vector embeddings, prompt engineering, agentic function calling, and deployment on serverless platforms. Prerequisites: Basic Python knowledge.',
      category: 'Workshop',
      date: futureDate2,
      startTime: '02:00 PM',
      endTime: '06:00 PM',
      venue: 'Innovation Hub 302',
      venueBuilding: 'Technology Center',
      venueRoom: 'Room 302',
      venueFloor: '3rd Floor',
      organizerName: 'Dr. Sophia Chen & AI Club Lead',
      organizerEmail: 'ai.club@campusconnect.edu',
      capacity: 80,
      registrationDeadline: new Date(futureDate2.getTime() - 12 * 60 * 60 * 1000),
      status: 'REGISTRATION_OPEN',
      featured: true,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['AI', 'Python', 'Workshop', 'Generative AI']),
    },
    {
      clubId: cyberClub.id,
      title: 'Capture The Flag (CTF): Cybersecurity Showdown',
      slug: 'ctf-cybersecurity-showdown',
      shortDescription: 'Test your reverse engineering, web exploitation, cryptography, and forensics skills in a live CTF arena.',
      description: 'Join the Cybersecurity Guild for our flagship CTF competition! Solve jeopardy-style challenges ranging from Beginner to Advanced. Real-time scoreboard, digital badges for top solvers, and vulnerability walkthroughs after the contest.',
      category: 'Competition',
      date: futureDate3,
      startTime: '01:00 PM',
      endTime: '07:00 PM',
      venue: 'Cyber Security Lab (Block C)',
      venueBuilding: 'Science & Cyber Block',
      venueRoom: 'Lab C-204',
      venueFloor: '2nd Floor',
      organizerName: 'Marcus Vance (Lead Security Analyst)',
      organizerEmail: 'marcus.vance@campusconnect.edu',
      capacity: 60,
      registrationDeadline: new Date(futureDate3.getTime() - 24 * 60 * 60 * 1000),
      status: 'REGISTRATION_OPEN',
      featured: false,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Cybersecurity', 'CTF', 'Hacking', 'Competition']),
    },
    {
      clubId: designClub.id,
      title: 'Figma to Code: Modern Design Systems & UI Components',
      slug: 'figma-to-code-design-systems',
      shortDescription: 'Bridge the gap between design and engineering. Craft interactive design tokens, Tailwind layouts, and accessible UI.',
      description: 'Learn how professional product designers and frontend engineers collaborate. We will build a design system in Figma and translate it directly into accessible React/Tailwind components live.',
      category: 'Workshop',
      date: futureDate4,
      startTime: '03:30 PM',
      endTime: '06:00 PM',
      venue: 'Media & Design Studio B',
      venueBuilding: 'Arts & Media Wing',
      venueRoom: 'Studio B',
      venueFloor: '1st Floor',
      organizerName: 'Elena Rostova (Design Lead)',
      organizerEmail: 'elena.design@campusconnect.edu',
      capacity: 50,
      registrationDeadline: new Date(futureDate4.getTime() - 12 * 60 * 60 * 1000),
      status: 'REGISTRATION_OPEN',
      featured: false,
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['UI/UX', 'Figma', 'Tailwind', 'Design Systems']),
    },
    {
      clubId: eCell.id,
      title: 'Campus Pitch Day: Student Founders Showcase',
      slug: 'campus-pitch-day-2026',
      shortDescription: '10 student startups pitch live in front of angel investors, alumni founders, and campus incubators.',
      description: 'Experience high-stakes startup pitches! Student entrepreneurs present their business models, prototypes, and traction. Audience gets to vote for the Student Choice Award.',
      category: 'Seminar',
      date: todayDate,
      startTime: '04:00 PM',
      endTime: '07:30 PM',
      venue: 'University Grand Auditorium',
      venueBuilding: 'Central Administration Block',
      venueRoom: 'Grand Auditorium',
      venueFloor: '1st Floor',
      organizerName: 'E-Cell Executive Board',
      organizerEmail: 'ecell.pitch@campusconnect.edu',
      capacity: 250,
      registrationDeadline: new Date(todayDate.getTime() - 2 * 60 * 60 * 1000),
      status: 'REGISTRATION_OPEN',
      featured: true,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Startup', 'Pitch', 'Entrepreneurship', 'Funding']),
    },
    {
      clubId: astroClub.id,
      title: 'Stargazing Night & Lunar Imaging Session',
      slug: 'stargazing-night-lunar-imaging',
      shortDescription: 'Explore the night sky using high-powered Dobsonian telescopes with guidance from physics researchers.',
      description: 'Bring your curiosity and warm clothes! We will observe Jupiter’s moons, Saturn’s rings, lunar craters, and deep-space nebulae. Free hot cocoa provided.',
      category: 'Club Meetup',
      date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      startTime: '08:00 PM',
      endTime: '11:00 PM',
      venue: 'Campus Observatory Deck (Roof)',
      venueBuilding: 'Physics Science Tower',
      venueRoom: 'Rooftop Observatory Deck',
      venueFloor: 'Roof (5th Floor)',
      organizerName: 'Leo Sterling (Astro Lead)',
      organizerEmail: 'astro.lead@campusconnect.edu',
      capacity: 40,
      registrationDeadline: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      status: 'REGISTRATION_OPEN',
      featured: false,
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Astronomy', 'Stargazing', 'Science', 'Telescope']),
    },
    {
      clubId: codingClub.id,
      title: 'Git & GitHub Mastery Bootcamp',
      slug: 'git-github-mastery-bootcamp',
      shortDescription: 'Master version control, merge conflict resolution, branching strategies, and GitHub Actions CI/CD.',
      description: 'A practical 3-hour session covering everything from basic git commands to advanced rebase, interactive staging, pull request reviews, and open-source workflow best practices.',
      category: 'Workshop',
      date: pastDate1,
      startTime: '03:00 PM',
      endTime: '06:00 PM',
      venue: 'CS Lab 401',
      venueBuilding: 'Computer Science Block',
      venueRoom: 'Lab 401',
      venueFloor: '4th Floor',
      organizerName: 'Coding Society Tech Leads',
      organizerEmail: 'codingsociety@campusconnect.edu',
      capacity: 70,
      registrationDeadline: new Date(pastDate1.getTime() - 12 * 60 * 60 * 1000),
      status: 'COMPLETED',
      featured: false,
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Git', 'GitHub', 'DevOps', 'Workshop']),
    },
    {
      clubId: aiClub.id,
      title: 'The Future of Autonomous AI Agents — Keynote & Panel',
      slug: 'future-of-ai-agents-keynote',
      shortDescription: 'Keynote speech by Dr. Aris Thorne followed by a panel with AI researchers and tech leaders.',
      description: 'An inspiring evening discussing how multi-agent architectures, neural reasoning models, and AI safety are shaping software engineering.',
      category: 'Tech Talk',
      date: pastDate2,
      startTime: '05:00 PM',
      endTime: '07:00 PM',
      venue: 'Main CS Auditorium',
      venueBuilding: 'Computer Science Block',
      venueRoom: 'Auditorium A',
      venueFloor: 'Ground Floor',
      organizerName: 'AI Club Research Team',
      organizerEmail: 'ai.club@campusconnect.edu',
      capacity: 150,
      registrationDeadline: new Date(pastDate2.getTime() - 24 * 60 * 60 * 1000),
      status: 'COMPLETED',
      featured: false,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['AI', 'Tech Talk', 'Keynote', 'Research']),
    },
    {
      clubId: eCell.id,
      title: 'Product Management 101: From 0 to 1 Product Specs',
      slug: 'product-management-101',
      shortDescription: 'Learn product roadmap building, user research, wireframing, and prioritization frameworks.',
      description: 'Interactive workshop on how top tech products are defined and built. Hands-on PRD writing exercise for student teams.',
      category: 'Workshop',
      date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      startTime: '02:00 PM',
      endTime: '05:00 PM',
      venue: 'Management Building Lecture Room 12',
      venueBuilding: 'School of Management',
      venueRoom: 'Hall 12',
      venueFloor: '1st Floor',
      organizerName: 'E-Cell PM Circle',
      organizerEmail: 'ecell@campusconnect.edu',
      capacity: 90,
      registrationDeadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      status: 'REGISTRATION_OPEN',
      featured: false,
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Product Management', 'UX', 'Strategy']),
    },
    {
      clubId: designClub.id,
      title: 'Annual Campus Design Exhibition & Showcase',
      slug: 'annual-design-exhibition',
      shortDescription: 'Exhibition showcasing student artwork, UI prototypes, 3D renders, and brand identity projects.',
      description: 'Explore creative student works, interact with digital installations, vote for best visual design, and network with agency recruiters.',
      category: 'Cultural',
      date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      startTime: '10:00 AM',
      endTime: '05:00 PM',
      venue: 'Campus Central Art Gallery',
      venueBuilding: 'Student Union Building',
      venueRoom: 'Art Gallery Main Hall',
      venueFloor: 'Ground Floor',
      organizerName: 'Design Society & Art Club',
      organizerEmail: 'design@campusconnect.edu',
      capacity: 300,
      registrationDeadline: new Date(now.getTime() + 19 * 24 * 60 * 60 * 1000),
      status: 'REGISTRATION_OPEN',
      featured: false,
      image: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=1000&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Design', 'Exhibition', 'Art', 'Cultural']),
    }
  ];

  const events = [];
  for (const e of eventsData) {
    const ev = await prisma.event.create({ data: e });
    events.push(ev);
  }
  console.log(`✅ Created ${events.length} events`);

  // Create Registrations & CheckIns for demo
  const sampleStudents = [
    { name: 'Rohan Sharma', email: 'rohan.sharma@student.edu', collegeYear: '3rd Year', phone: '+91 98765 43210', branch: 'Computer Science', studentId: 'CS2023-042' },
    { name: 'Priya Patel', email: 'priya.patel@student.edu', collegeYear: '2nd Year', phone: '+91 98123 45678', branch: 'Information Tech', studentId: 'IT2024-019' },
    { name: 'Aarav Gupta', email: 'aarav.gupta@student.edu', collegeYear: '4th Year', phone: '+91 99887 76655', branch: 'Electronics (ECE)', studentId: 'EC2022-110' },
    { name: 'Ananya Verma', email: 'ananya.verma@student.edu', collegeYear: '1st Year', phone: '+91 97654 32109', branch: 'Artificial Intelligence', studentId: 'AI2025-005' },
    { name: 'Kabir Mehta', email: 'kabir.mehta@student.edu', collegeYear: '3rd Year', phone: '+91 95432 10987', branch: 'Mechanical Eng', studentId: 'ME2023-088' },
    { name: 'Sneha Roy', email: 'sneha.roy@student.edu', collegeYear: '2nd Year', phone: '+91 91234 56789', branch: 'Data Science', studentId: 'DS2024-031' },
    { name: 'Vikram Singh', email: 'vikram.singh@student.edu', collegeYear: '4th Year', phone: '+91 98765 11223', branch: 'Computer Science', studentId: 'CS2022-094' },
    { name: 'Diya Nair', email: 'diya.nair@student.edu', collegeYear: '3rd Year', phone: '+91 99001 12233', branch: 'Biotechnology', studentId: 'BT2023-014' },
  ];

  let regCounter = 100;
  const codes: string[] = [];

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    // Register 3-6 students for each event
    const countToRegister = 3 + (i % 4);
    for (let s = 0; s < countToRegister; s++) {
      const student = sampleStudents[s % sampleStudents.length];
      regCounter++;
      const regCode = `CC-2026-${regCounter}`;
      codes.push(regCode);

      const isCheckedIn = (ev.status === 'COMPLETED' || i === 0) && s % 2 === 0;

      const reg = await prisma.registration.create({
        data: {
          registrationCode: regCode,
          eventId: ev.id,
          name: student.name,
          email: `${s}_${student.email}`,
          collegeYear: student.collegeYear,
          phone: student.phone,
          branch: student.branch,
          studentId: student.studentId,
          status: isCheckedIn ? 'CHECKED_IN' : 'CONFIRMED',
          registeredAt: new Date(now.getTime() - (i + s) * 3 * 3600 * 1000),
        },
      });

      if (isCheckedIn) {
        await prisma.checkIn.create({
          data: {
            registrationId: reg.id,
            checkedInBy: 'Admin Desk Scanner',
            checkedInAt: new Date(now.getTime() - s * 30 * 60 * 1000),
          },
        });
      }

      // Add feedback for completed events
      if (ev.status === 'COMPLETED' && s % 2 === 0) {
        await prisma.feedback.create({
          data: {
            eventId: ev.id,
            registrationId: reg.id,
            rating: 5 - (s % 2),
            comment: s % 2 === 0 ? 'Amazing workshop! Learned so much hands-on code.' : 'Great speaker presentation and well-organized venue.',
          },
        });
      }
    }
  }

  console.log(`✅ Seeded ${codes.length} registrations and check-ins`);

  // Create initial audit log
  await prisma.auditLog.create({
    data: {
      actor: 'System Seed',
      action: 'DATABASE_INITIALIZED',
      entityType: 'SYSTEM',
      entityId: 'SYSTEM',
      metadata: JSON.stringify({ seededAt: new Date().toISOString(), eventsCount: events.length }),
    },
  });

  console.log('🎉 CampusConnect Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
