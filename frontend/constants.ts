import { Team, Competition } from './types';

export const TEAMS: Team[] = [
    { id: 1, name: 'Korean White Tigers', nameParts: ['Korean', 'White Tigers'], country: 'South Korea', iso_name: 'KOR', bgColor: '#EAEAEA', textColor: '#001F60', photo_url: '/team-photos/south_korea.png' },
    { id: 2, name: 'USA Eagles', nameParts: ['USA', 'Eagles'], country: 'USA', iso_name: 'USA', bgColor: '#002868', textColor: '#FFFFFF', photo_url: '/team-photos/usa.png' },
    { id: 3, name: 'Dutch Lions', nameParts: ['Dutch', 'Lions'], country: 'Netherlands', iso_name: 'NLD', bgColor: '#F47920', textColor: '#FFFFFF', photo_url: '/team-photos/netherlands.png' },
    { id: 4, name: 'Belgium Ice Bears', nameParts: ['Belgium', 'Ice Bears'], country: 'Belgium', iso_name: 'BEL', bgColor: '#F0F0F0', textColor: '#000000', photo_url: '/team-photos/belgium.png' },
    { id: 5, name: 'Canadian Ice Maples', nameParts: ['Canadian', 'Ice Maples'], country: 'Canada', iso_name: 'CAN', bgColor: '#1A1A1A', textColor: '#FF0000', photo_url: '/team-photos/canada.png' },
    { id: 6, name: 'Chinese Loongs', nameParts: ['Chinese', 'Loongs'], country: 'China', iso_name: 'CHN', bgColor: '#EE1C25', textColor: '#FFFF00', photo_url: '/team-photos/china.png' },
    { id: 7, name: 'Polish Hussars', nameParts: ['Polish', 'Hussars'], country: 'Poland', iso_name: 'POL', bgColor: '#FFFFFF', textColor: '#DC143C', photo_url: '/team-photos/poland.jpg' },
    { id: 8, name: 'Italian Gladiators', nameParts: ['Italian', 'Gladiators'], country: 'Italy', iso_name: 'ITA', bgColor: '#0055A4', textColor: '#FFFFFF', photo_url: '/team-photos/italy.png' },
    { id: 9, name: 'Kazakh Nomads', nameParts: ['Kazakh', 'Nomads'], country: 'Kazakhstan', iso_name: 'KAZ', bgColor: '#1E2952', textColor: '#F0E14A', photo_url: '/team-photos/kazakhstan.jpg' },
    { id: 10, name: 'Japanese Ninjas', nameParts: ['Japanese', 'Ninjas'], country: 'Japan', iso_name: 'JPN', bgColor: '#FFFFFF', textColor: '#BC002D', photo_url: '/team-photos/japan.jpg' },
    { id: 11, name: 'Hungarian Falcons', nameParts: ['Hungarian', 'Falcons'], country: 'Hungary', iso_name: 'HUN', bgColor: '#231F20', textColor: '#FFFFFF', photo_url: '/team-photos/hungary.jpg' },
    { id: 12, name: 'French Roosters', nameParts: ['French', 'Roosters'], country: 'France', iso_name: 'FRA', bgColor: '#002395', textColor: '#FFFFFF', photo_url: '/team-photos/france.jpg' },
    { id: 13, name: 'British Royals', nameParts: ['British', 'Royals'], country: 'Great Britain', iso_name: 'GBR', bgColor: '#012169', textColor: '#FFFFFF', photo_url: '/team-photos/great_britain.jpg' },
    { id: 14, name: 'Ukrainian Wild Cats', nameParts: ['Ukrainian', 'Wild Cats'], country: 'Ukraine', iso_name: 'UKR', bgColor: '#0057B7', textColor: '#FFDD00', photo_url: '/team-photos/ukraine.jpg' },
    { id: 15, name: 'Croatian Dalmatians', nameParts: ['Croatian', 'Dalmatians'], country: 'Croatia', iso_name: 'HRV', bgColor: '#1C1C1C', textColor: '#FFFFFF', photo_url: '/team-photos/croatia.jpg' },
    { id: 16, name: 'German Wolves', nameParts: ['German', 'Wolves'], country: 'Germany', iso_name: 'DEU', bgColor: '#1C1C1C', textColor: '#FFCE00', photo_url: '/team-photos/germany.jpg' },
    { id: 17, name: 'Czechia Ice Spiders', nameParts: ['Czechia', 'Ice Spiders'], country: 'Czechia', iso_name: 'CZE', bgColor: '#003153', textColor: '#FFFFFF', photo_url: '/team-photos/czechia.jpg' },
    { id: 18, name: 'Bulgarian Kings', nameParts: ['Bulgarian', 'Kings'], country: 'Bulgaria', iso_name: 'BGR', bgColor: '#222222', textColor: '#FFFFFF', photo_url: '/team-photos/bulgaria.jpg' },
    { id: 19, name: 'Latvian Golden Stars', nameParts: ['Latvian', 'Golden Stars'], country: 'Latvia', iso_name: 'LVA', bgColor: '#FDFBF8', textColor: '#A4343A', photo_url: '/team-photos/latvia.png' },
    { id: 20, name: 'Australian Racing Roos', nameParts: ['Australian', 'Racing Roos'], country: 'Australia', iso_name: 'AUS', bgColor: '#006A4E', textColor: '#FFCD00', photo_url: '/team-photos/australia.jpg' },
    { id: 21, name: 'Turkish Anatolian Pars', nameParts: ['Turkish', 'Anatolian Pars'], country: 'Turkey', iso_name: 'TUR', bgColor: '#212121', textColor: '#FFFFFF', photo_url: '/team-photos/turkey.png' },
    { id: 22, name: 'Hong Kong Ice Qilins', nameParts: ['Hong Kong', 'Ice Qilins'], country: 'Hong Kong', iso_name: 'HKG', bgColor: '#E40001', textColor: '#FFFFFF', photo_url: '/team-photos/hong-kong.jpg' },
    { id: 23, name: 'New Zealand Ice Keas', nameParts: ['New Zealand', 'Ice Keas'], country: 'New Zealand', iso_name: 'NZL', bgColor: '#121212', textColor: '#FFFFFF', photo_url: '/team-photos/new-zealand.jpg' },
    { id: 24, name: 'Irish Wolf Hounds', nameParts: ['Irish', 'Wolf Hounds'], country: 'Ireland', iso_name: 'IRL', bgColor: '#009A44', textColor: '#FFFFFF', photo_url: '/team-photos/ireland.png' },
    { id: 25, name: 'Swiss Ibex', nameParts: ['Swiss', 'Ibex'], country: 'Switzerland', iso_name: 'CHE', bgColor: '#DA291C', textColor: '#FFFFFF', photo_url: '/team-photos/switzerland.jpg' },
    { id: 26, name: 'Norwegian Vikings', nameParts: ['Norwegian', 'Vikings'], country: 'Norway', iso_name: 'NOR', bgColor: '#BA0C2F', textColor: '#FFFFFF', photo_url: '/team-photos/norway.jpg' },
    { id: 27, name: 'Thai Elephants', nameParts: ['Thai', 'Elephants'], country: 'Thailand', iso_name: 'THA', bgColor: '#3C3658', textColor: '#FFFFFF', photo_url: '/team-photos/thailand.jpg' },
    { id: 28, name: 'Singapore Gazelles', nameParts: ['Singapore', 'Gazelles'], country: 'Singapore', iso_name: 'SGP', bgColor: '#ED2939', textColor: '#FFFFFF', photo_url: '/team-photos/singapore.jpg' },
    { id: 29, name: 'Philippine Tamaraws', nameParts: ['Philippine', 'Tamaraws'], country: 'Philippines', iso_name: 'PHL', bgColor: '#0038A8', textColor: '#FCD116', photo_url: '/team-photos/philippines.png' },
];


export const COMPETITIONS: Competition[] = [
  { 
    id: 1, 
    title: 'World Cup 1', 
    location: 'Montréal', 
    country: 'Canada', 
    date: 'Oct 26-27, 2024', 
    details: 'Maurice Richard Arena',
    stages: [
      { name: 'Qualifying', topQualifiers: [
        { name: 'Kim Min-seo', country: 'South Korea', time: '2:18.543' },
        { name: 'Jordan Pierre-Gilles', country: 'Canada', time: '2:18.991' },
        { name: 'Suzanne Schulting', country: 'Netherlands', time: '2:19.013' },
        { name: 'John-Henry Krueger', country: 'USA', time: '2:19.245' },
        { name: 'Pietro Sighel', country: 'Italy', time: '2:19.333' }
      ]},
      { name: 'Heats', topQualifiers: [
        { name: 'Hwang Dae-heon', country: 'South Korea', time: '1:25.112' },
        { name: 'Steven Dubois', country: 'Canada', time: '1:25.345' },
        { name: 'Xandra Velzeboer', country: 'Netherlands', time: '1:25.601' },
        { name: 'Arianna Fontana', country: 'Italy', time: '1:25.888' }
      ]},
      { name: 'Quarter-Finals', topQualifiers: [
        { name: 'Park Ji-won', country: 'South Korea', time: '40.556' },
        { name: 'Pascal Dion', country: 'Canada', time: '40.781' },
        { name: 'Jens van \'t Wout', country: 'Netherlands', time: '40.912' }
      ]},
      { name: 'Semi-Finals', topQualifiers: [
        { name: 'Choi Min-jeong', country: 'South Korea', time: '1:26.004' },
        { name: 'Courtney Sarault', country: 'Canada', time: '1:26.231' }
      ]},
      { name: 'Finals', topQualifiers: [
        { name: 'Seo Whi-min', country: 'South Korea', time: '2:22.123' },
        { name: 'Félix Roussel', country: 'Canada', time: '2:22.456' },
        { name: 'Selma Poutsma', country: 'Netherlands', time: '2:22.789' }
      ]},
    ],
    races: [
      { title: "Men's 1500m - Final A", videoId: '5fI3t_J4iyE' },
      { title: "Women's 1000m - Final B", videoId: 'nN722iSc85I' },
      { title: "Mixed Relay 2000m - Final", videoId: 'B-DrwA97y4o' },
      { title: "Men's 500m - Highlights", videoId: 'cHVrVCoG4iA' },
    ],
    stats: [
        { title: 'World Records', value: '2' },
        { title: 'Top Speed', value: '54 km/h' },
        { title: 'Penalties', value: '12' },
        { title: 'Photo Finishes', value: '5' },
        { title: 'Total Laps', value: '1,240' },
        { title: 'Skaters', value: '150' },
        { title: 'Nations', value: '28' },
        { title: 'Closest Finish', value: '0.002s' },
    ],
    teamStats: [
        { metric: 'Avg. Lap Time', teamValue: '8.92s', averageValue: '9.04s', delta: '-0.12s', positive: true },
        { metric: 'Starts Won', teamValue: '75%', averageValue: '80%', delta: '-5%', positive: false },
        { metric: 'Successful Passes', teamValue: '14', averageValue: '11', delta: '+3', positive: true },
        { metric: 'Finals Appearance', teamValue: '6', averageValue: '4', delta: '+2', positive: true },
        { metric: 'Avg. Finish Pos.', teamValue: '2.1', averageValue: '3.5', delta: '-1.4', positive: true },
        { metric: 'Penalties', teamValue: '1', averageValue: '3', delta: '-2', positive: true },
    ]
  },
  { 
    id: 2, 
    title: 'World Cup 2', 
    location: 'Montréal', 
    country: 'Canada', 
    date: 'Nov 2-3, 2024', 
    details: 'Maurice Richard Arena',
    stages: [
      { name: 'Qualifying', topQualifiers: [
        { name: 'Liu Shaoang', country: 'China', time: '40.129' },
        { name: 'William Dandjinou', country: 'Canada', time: '40.334' },
        { name: 'Hanne Desmet', country: 'Belgium', time: '40.582' },
        { name: 'Kristen Santos-Griswold', country: 'USA', time: '40.671' },
        { name: 'Andrea Cassinelli', country: 'Italy', time: '40.899' }
      ]},
      { name: 'Heats', topQualifiers: [
        { name: 'Lin Xiaojun', country: 'China', time: '1:24.888' },
        { name: 'Maxime Laoun', country: 'Canada', time: '1:24.912' },
        { name: 'Suzanne Schulting', country: 'Netherlands', time: '1:25.011' },
        { name: 'Arianna Fontana', country: 'Italy', time: '1:25.234' }
      ]},
      { name: 'Quarter-Finals', topQualifiers: [
        { name: 'Lim Hyo-jun', country: 'China', time: '2:15.987' },
        { name: 'Pascal Dion', country: 'Canada', time: '2:16.111' },
        { name: 'Jens van \'t Wout', country: 'Netherlands', time: '2:16.321' }
      ]},
      { name: 'Semi-Finals', topQualifiers: [
        { name: 'Fan Kexin', country: 'China', time: '41.001' },
        { name: 'Kim Boutin', country: 'Canada', time: '41.123' }
      ]},
      { name: 'Finals', topQualifiers: [
        { name: 'Ren Ziwei', country: 'China', time: '1:23.789' },
        { name: 'Steven Dubois', country: 'Canada', time: '1:23.999' },
        { name: 'Yara van Kerkhof', country: 'Netherlands', time: '1:24.135' }
      ]},
    ],
    races: [
      { title: "Women's 1500m - Final A", videoId: 'Lbfz_9tX-3o' },
      { title: "Men's 1000m - Final A", videoId: 'YwBSw8d8w8A' },
      { title: "Women's 3000m Relay - Final", videoId: '_gAMb4g9vP8' },
      { title: "Men's 500m - Final A", videoId: 'gJZoqX02Y4g' },
    ],
    stats: [
        { title: 'World Records', value: '1' },
        { title: 'Top Speed', value: '55 km/h' },
        { title: 'Penalties', value: '15' },
        { title: 'Photo Finishes', value: '3' },
        { title: 'Total Laps', value: '1,310' },
        { title: 'Skaters', value: '155' },
        { title: 'Nations', value: '29' },
        { title: 'Closest Finish', value: '0.004s' },
    ],
    teamStats: [
        { metric: 'Avg. Lap Time', teamValue: '8.95s', averageValue: '9.01s', delta: '-0.06s', positive: true },
        { metric: 'Starts Won', teamValue: '81%', averageValue: '80%', delta: '+1%', positive: true },
        { metric: 'Successful Passes', teamValue: '12', averageValue: '11', delta: '+1', positive: true },
        { metric: 'Finals Appearance', teamValue: '5', averageValue: '4', delta: '+1', positive: true },
        { metric: 'Avg. Finish Pos.', teamValue: '2.5', averageValue: '3.5', delta: '-1.0', positive: true },
        { metric: 'Penalties', teamValue: '2', averageValue: '3', delta: '-1', positive: true },
    ]
  },
  { 
    id: 3, 
    title: 'World Cup 3', 
    location: 'Beijing', 
    country: 'China', 
    date: 'Dec 7-8, 2024', 
    details: 'Capital Indoor Stadium',
    stages: [
        { name: 'Qualifying', topQualifiers: [
          { name: 'Shaoang Liu', country: 'China', time: '1:22.123' },
          { name: 'Park Ji-won', country: 'South Korea', time: '1:22.456' },
          { name: 'Selma Poutsma', country: 'Netherlands', time: '1:22.789' }
        ]},
        { name: 'Heats', topQualifiers: [
          { name: 'Lin Xiaojun', country: 'China', time: '40.111' },
          { name: 'Hwang Dae-heon', country: 'South Korea', time: '40.222' }
        ]},
        { name: 'Quarter-Finals', topQualifiers: [
          { name: 'Ren Ziwei', country: 'China', time: '2:19.876' },
          { name: 'Steven Dubois', country: 'Canada', time: '2:20.123' }
        ]},
        { name: 'Semi-Finals', topQualifiers: [
          { name: 'Kim Geon-hee', country: 'South Korea', time: '1:28.123' },
          { name: 'Xandra Velzeboer', country: 'Netherlands', time: '1:28.456' }
        ]},
        { name: 'Finals', topQualifiers: [
          { name: 'Sun Long', country: 'China', time: '40.321' },
          { name: 'Kim Gil-li', country: 'South Korea', time: '40.654' },
          { name: 'Jordan Pierre-Gilles', country: 'Canada', time: '40.987' }
        ]},
    ],
    races: [
      { title: "Highlights Day 1", videoId: '8Y7z2k0eJ2c' },
      { title: "Highlights Day 2", videoId: 'Jg765g4gH8s' },
      { title: "Men's 5000m Relay Final", videoId: 'Q8g9g5dJ5g4' },
      { title: "Women's 1500m Final", videoId: 'nN722iSc85I' },
    ],
    stats: [
        { title: 'World Records', value: '0' },
        { title: 'Top Speed', value: '53.8 km/h' },
        { title: 'Penalties', value: '18' },
        { title: 'Photo Finishes', value: '6' },
        { title: 'Total Laps', value: '1,280' },
        { title: 'Skaters', value: '148' },
        { title: 'Nations', value: '27' },
        { title: 'Closest Finish', value: '0.003s' },
    ],
    teamStats: [
        { metric: 'Avg. Lap Time', teamValue: '8.99s', averageValue: '9.05s', delta: '-0.06s', positive: true },
        { metric: 'Starts Won', teamValue: '78%', averageValue: '80%', delta: '-2%', positive: false },
        { metric: 'Successful Passes', teamValue: '10', averageValue: '12', delta: '-2', positive: false },
        { metric: 'Finals Appearance', teamValue: '4', averageValue: '4', delta: '+0', positive: true },
        { metric: 'Avg. Finish Pos.', teamValue: '2.9', averageValue: '3.6', delta: '-0.7', positive: true },
        { metric: 'Penalties', teamValue: '3', averageValue: '3', delta: '0', positive: true },
    ]
  },
  { 
    id: 4, 
    title: 'World Cup 4', 
    location: 'Seoul', 
    country: 'South Korea', 
    date: 'Dec 14-15, 2024', 
    details: 'Mokdong Ice Rink',
    stages: [
        { name: 'Qualifying', topQualifiers: [
          { name: 'Kim Gil-li', country: 'South Korea', time: '41.123' },
          { name: 'Lee June-seo', country: 'South Korea', time: '41.456' },
          { name: 'Kristen Santos-Griswold', country: 'USA', time: '41.789' }
        ]},
        { name: 'Heats', topQualifiers: [
          { name: 'Seo Whi-min', country: 'South Korea', time: '1:27.111' },
          { name: 'Jang Sung-woo', country: 'South Korea', time: '1:27.222' },
          { name: 'Pietro Sighel', country: 'Italy', time: '1:27.333' }
        ]},
        { name: 'Quarter-Finals', topQualifiers: [
          { name: 'Park Ji-won', country: 'South Korea', time: '2:17.123' },
          { name: 'Shim Suk-hee', country: 'South Korea', time: '2:17.456' },
        ]},
        { name: 'Semi-Finals', topQualifiers: [
          { name: 'Choi Min-jeong', country: 'South Korea', time: '40.987' },
          { name: 'Kim Geon-hee', country: 'South Korea', time: '41.111' }
        ]},
        { name: 'Finals', topQualifiers: [
          { name: 'Hwang Dae-heon', country: 'South Korea', time: '1:25.123' },
          { name: 'Lee So-yeon', country: 'South Korea', time: '1:25.456' },
          { name: 'Steven Dubois', country: 'Canada', time: '1:25.789' }
        ]},
    ],
    races: [
      { title: "Men's 1000m Final", videoId: '5fI3t_J4iyE' },
      { title: "Women's 1000m Final", videoId: 'Lbfz_9tX-3o' },
      { title: "Mixed Relay Final", videoId: 'B-DrwA97y4o' },
      { title: "Men's 500m Final", videoId: 'cHVrVCoG4iA' },
    ],
    stats: [
        { title: 'World Records', value: '3' },
        { title: 'Top Speed', value: '56.1 km/h' },
        { title: 'Penalties', value: '9' },
        { title: 'Photo Finishes', value: '4' },
        { title: 'Total Laps', value: '1,350' },
        { title: 'Skaters', value: '160' },
        { title: 'Nations', value: '30' },
        { title: 'Closest Finish', value: '0.001s' },
    ],
    teamStats: [
        { metric: 'Avg. Lap Time', teamValue: '8.88s', averageValue: '9.02s', delta: '-0.14s', positive: true },
        { metric: 'Starts Won', teamValue: '85%', averageValue: '80%', delta: '+5%', positive: true },
        { metric: 'Successful Passes', teamValue: '18', averageValue: '12', delta: '+6', positive: true },
        { metric: 'Finals Appearance', teamValue: '8', averageValue: '4', delta: '+4', positive: true },
        { metric: 'Avg. Finish Pos.', teamValue: '1.8', averageValue: '3.5', delta: '-1.7', positive: true },
        { metric: 'Penalties', teamValue: '0', averageValue: '2', delta: '-2', positive: true },
    ]
  },
  { 
    id: 5, 
    title: 'World Cup 5', 
    location: 'Tilburg', 
    country: 'Netherlands', 
    date: 'Feb 8-9, 2025', 
    details: 'Ireen Wüst IJsbaan',
    stages: [
        { name: 'Qualifying', topQualifiers: [
          { name: 'Jens van \'t Wout', country: 'Netherlands', time: '2:16.123' },
          { name: 'Teun Boer', country: 'Netherlands', time: '2:16.456' },
          { name: 'Hanne Desmet', country: 'Belgium', time: '2:16.789' }
        ]},
        { name: 'Heats', topQualifiers: [
          { name: 'Suzanne Schulting', country: 'Netherlands', time: '1:26.111' },
          { name: 'Xandra Velzeboer', country: 'Netherlands', time: '1:26.222' },
          { name: 'William Dandjinou', country: 'Canada', time: '1:26.333' }
        ]},
        { name: 'Quarter-Finals', topQualifiers: [
          { name: 'Selma Poutsma', country: 'Netherlands', time: '40.123' },
          { name: 'Kay Huisman', country: 'Netherlands', time: '40.456' }
        ]},
        { name: 'Semi-Finals', topQualifiers: [
          { name: 'Yara van Kerkhof', country: 'Netherlands', time: '1:29.123' },
          { name: 'Melle van \'t Wout', country: 'Netherlands', time: '1:29.456' }
        ]},
        { name: 'Finals', topQualifiers: [
          { name: 'Daan Breeuwsma', country: 'Netherlands', time: '2:21.123' },
          { name: 'Michelle Velzeboer', country: 'Netherlands', time: '2:21.456' },
          { name: 'Pietro Sighel', country: 'Italy', time: '2:21.789' }
        ]},
    ],
    races: [
      { title: "Men's 500m Final", videoId: 'gJZoqX02Y4g' },
      { title: "Women's 500m Final", videoId: 'YwBSw8d8w8A' },
      { title: "Men's 1500m Final", videoId: '_gAMb4g9vP8' },
      { title: "Women's 1500m Final", videoId: 'Lbfz_9tX-3o' },
    ],
    stats: [
        { title: 'World Records', value: '1' },
        { title: 'Top Speed', value: '54.5 km/h' },
        { title: 'Penalties', value: '11' },
        { title: 'Photo Finishes', value: '7' },
        { title: 'Total Laps', value: '1,300' },
        { title: 'Skaters', value: '152' },
        { title: 'Nations', value: '28' },
        { title: 'Closest Finish', value: '0.005s' },
    ],
    teamStats: [
        { metric: 'Avg. Lap Time', teamValue: '8.90s', averageValue: '9.03s', delta: '-0.13s', positive: true },
        { metric: 'Starts Won', teamValue: '82%', averageValue: '80%', delta: '+2%', positive: true },
        { metric: 'Successful Passes', teamValue: '15', averageValue: '11', delta: '+4', positive: true },
        { metric: 'Finals Appearance', teamValue: '7', averageValue: '4', delta: '+3', positive: true },
        { metric: 'Avg. Finish Pos.', teamValue: '2.0', averageValue: '3.4', delta: '-1.4', positive: true },
        { metric: 'Penalties', teamValue: '1', averageValue: '3', delta: '-2', positive: true },
    ]
  },
  { 
    id: 6, 
    title: 'World Cup 6', 
    location: 'Milan', 
    country: 'Italy', 
    date: 'Feb 15-16, 2025', 
    details: 'Forum di Milano',
    stages: [
        { name: 'Qualifying', topQualifiers: [
          { name: 'Arianna Fontana', country: 'Italy', time: '40.321' },
          { name: 'Martina Valcepina', country: 'Italy', time: '40.654' },
          { name: 'Park Ji-won', country: 'South Korea', time: '40.987' }
        ]},
        { name: 'Heats', topQualifiers: [
          { name: 'Pietro Sighel', country: 'Italy', time: '1:24.111' },
          { name: 'Andrea Cassinelli', country: 'Italy', time: '1:24.222' },
          { name: 'Steven Dubois', country: 'Canada', time: '1:24.333' }
        ]},
        { name: 'Quarter-Finals', topQualifiers: [
          { name: 'Tommaso Dotti', country: 'Italy', time: '2:18.123' },
          { name: 'Suzanne Schulting', country: 'Netherlands', time: '2:18.456' }
        ]},
        { name: 'Semi-Finals', topQualifiers: [
          { name: 'Arianna Valcepina', country: 'Italy', time: '41.123' },
          { name: 'Hwang Dae-heon', country: 'South Korea', time: '41.456' }
        ]},
        { name: 'Finals', topQualifiers: [
          { name: 'Yuri Confortola', country: 'Italy', time: '1:26.123' },
          { name: 'Elena Viviani', country: 'Italy', time: '1:26.456' },
          { name: 'Shaoang Liu', country: 'China', time: '1:26.789' }
        ]},
    ],
    races: [
      { title: "Men's Relay Final", videoId: 'Q8g9g5dJ5g4' },
      { title: "Women's Relay Final", videoId: 'nN722iSc85I' },
      { title: "Men's 1000m Final", videoId: '5fI3t_J4iyE' },
      { title: "Women's 1000m Final", videoId: 'B-DrwA97y4o' },
    ],
    stats: [
        { title: 'World Records', value: '1' },
        { title: 'Top Speed', value: '54.9 km/h' },
        { title: 'Penalties', value: '13' },
        { title: 'Photo Finishes', value: '5' },
        { title: 'Total Laps', value: '1,295' },
        { title: 'Skaters', value: '150' },
        { title: 'Nations', value: '29' },
        { title: 'Closest Finish', value: '0.002s' },
    ],
    teamStats: [
        { metric: 'Avg. Lap Time', teamValue: '8.94s', averageValue: '9.04s', delta: '-0.10s', positive: true },
        { metric: 'Starts Won', teamValue: '79%', averageValue: '80%', delta: '-1%', positive: false },
        { metric: 'Successful Passes', teamValue: '13', averageValue: '12', delta: '+1', positive: true },
        { metric: 'Finals Appearance', teamValue: '6', averageValue: '4', delta: '+2', positive: true },
        { metric: 'Avg. Finish Pos.', teamValue: '2.3', averageValue: '3.5', delta: '-1.2', positive: true },
        { metric: 'Penalties', teamValue: '2', averageValue: '3', delta: '-1', positive: true },
    ]
  },
  {
    id: 7,
    title: 'World Cup 7',
    location: 'Gdansk',
    country: 'Poland',
    date: 'Feb 22-23, 2025',
    details: 'Hala Olivia',
    stages: [
        { name: 'Qualifying', topQualifiers: [
            { name: 'Diane Sellier', country: 'Poland', time: '1:23.456' },
            { name: 'Nikola Mazur', country: 'Poland', time: '1:23.789' },
            { name: 'Kim Geon-hee', country: 'South Korea', time: '1:24.012' }
        ]},
        { name: 'Heats', topQualifiers: [
            { name: 'Piotr Kuczynski', country: 'Poland', time: '40.987' },
            { name: 'Hwang Dae-heon', country: 'South Korea', time: '41.123' },
        ]},
        { name: 'Finals', topQualifiers: [
            { name: 'Kamila Stormowska', country: 'Poland', time: '2:20.123' },
            { name: 'Jens van \'t Wout', country: 'Netherlands', time: '2:20.456' },
            { name: 'Steven Dubois', country: 'Canada', time: '2:20.789' }
        ]},
    ],
    races: [
      { title: "Mixed Relay Final", videoId: 'dQw4w9WgXcQ' },
      { title: "Men's 1500m Final", videoId: 'YwBSw8d8w8A' },
    ],
    stats: [
        { title: 'World Records', value: '0' },
        { title: 'Top Speed', value: '54.2 km/h' },
        { title: 'Penalties', value: '14' },
        { title: 'Photo Finishes', value: '8' },
        { title: 'Total Laps', value: '1,320' },
        { title: 'Skaters', value: '158' },
        { title: 'Nations', value: '31' },
        { title: 'Closest Finish', value: '0.001s' },
    ],
    teamStats: [
        { metric: 'Avg. Lap Time', teamValue: '8.91s', averageValue: '9.03s', delta: '-0.12s', positive: true },
        { metric: 'Starts Won', teamValue: '80%', averageValue: '80%', delta: '0%', positive: true },
        { metric: 'Successful Passes', teamValue: '12', averageValue: '11', delta: '+1', positive: true },
        { metric: 'Finals Appearance', teamValue: '5', averageValue: '4', delta: '+1', positive: true },
        { metric: 'Avg. Finish Pos.', teamValue: '2.4', averageValue: '3.5', delta: '-1.1', positive: true },
        { metric: 'Penalties', teamValue: '2', averageValue: '3', delta: '-1', positive: true },
    ]
  },
  {
    id: 8,
    title: 'World Championships',
    location: 'Dresden',
    country: 'Germany',
    date: 'Mar 14-16, 2025',
    details: 'EnergieVerbund Arena',
    stages: [
        { name: 'Heats', topQualifiers: [
            { name: 'Anna Seidel', country: 'Germany', time: '2:19.123' },
            { name: 'Choi Min-jeong', country: 'South Korea', time: '2:19.456' },
            { name: 'Suzanne Schulting', country: 'Netherlands', time: '2:19.789' }
        ]},
        { name: 'Semi-Finals', topQualifiers: [
            { name: 'Pascal Dion', country: 'Canada', time: '1:22.111' },
            { name: 'Shaoang Liu', country: 'China', time: '1:22.222' }
        ]},
        { name: 'Finals', topQualifiers: [
            { name: 'Park Ji-won', country: 'South Korea', time: '40.001' },
            { name: 'Steven Dubois', country: 'Canada', time: '40.002' },
            { name: 'Pietro Sighel', country: 'Italy', time: '40.003' }
        ]},
    ],
    races: [
      { title: "Men's Overall Final Rankings", videoId: '5fI3t_J4iyE' },
      { title: "Women's Overall Final Rankings", videoId: 'nN722iSc85I' },
    ],
    stats: [
        { title: 'World Champions', value: '4' },
        { title: 'Top Speed', value: '57.3 km/h' },
        { title: 'Penalties', value: '8' },
        { title: 'Photo Finishes', value: '10' },
        { title: 'Total Laps', value: '1,500' },
        { title: 'Skaters', value: '180' },
        { title: 'Nations', value: '35' },
        { title: 'Closest Finish', value: '0.001s' },
    ],
    teamStats: [
        { metric: 'Avg. Lap Time', teamValue: '8.85s', averageValue: '8.98s', delta: '-0.13s', positive: true },
        { metric: 'Starts Won', teamValue: '88%', averageValue: '82%', delta: '+6%', positive: true },
        { metric: 'Successful Passes', teamValue: '20', averageValue: '14', delta: '+6', positive: true },
        { metric: 'Finals Appearance', teamValue: '9', averageValue: '5', delta: '+4', positive: true },
        { metric: 'Avg. Finish Pos.', teamValue: '1.5', averageValue: '3.2', delta: '-1.7', positive: true },
        { metric: 'Penalties', teamValue: '0', averageValue: '2', delta: '-2', positive: true },
    ]
  },
];