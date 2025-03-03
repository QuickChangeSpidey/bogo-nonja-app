const genres = [
    {
      id: '1',
      genre: 'BOGO Favorites',
      restaurants: [
        { id: '1', name: 'Burger King', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '8 AM - 10 PM', coupons: 1,  days: 'Mon - Fri' },
        { id: '2', name: 'McDonald’s', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '9 AM - 11 PM', coupons: 3,  days: 'Mon - Fri' },
        { id: '3', name: 'Wendy’s', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '10 AM - 11 PM', coupons: 2,  days: 'Mon - Fri' },
        { id: '4', name: 'KFC', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '11 AM - 10 PM', coupons: 4,  days: 'Mon - Fri' },
        { id: '5', name: 'Taco Bell', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '12 PM - 12 AM', coupons: 5,  days: 'Mon - Fri' },
      ],
    },
    {
      id: '2',
      genre: 'Trending Near You',
      restaurants: [
        { id: '6', name: 'Golden Dragon', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '10 AM - 12 PM', coupons: 2,  days: 'Mon - Fri' },
        { id: '7', name: 'Panda Express', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '9 AM - 11 PM', coupons: 1,  days: 'Mon - Fri' },
        { id: '8', name: 'China Bowl', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '10 AM - 10 PM', coupons: 4,  days: 'Mon - Fri' },
        { id: '9', name: 'Dragon Wok', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '11 AM - 9 PM', coupons: 3,  days: 'Mon - Fri' },
        { id: '10', name: 'Noodle King', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '12 PM - 11 PM', coupons: 2,  days: 'Mon - Fri' },
      ],
    },
    {
      id: '3',
      genre: 'Best Value Deals',
      restaurants: [
        { id: '11', name: 'Sushi Heaven', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '11 AM - 10 PM', coupons: 2,  days: 'Mon - Fri' },
        { id: '12', name: 'Pho Delight', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '10 AM - 9 PM', coupons: 4,  days: 'Mon - Fri' },
        { id: '13', name: 'Korean BBQ House', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '12 PM - 12 AM', coupons: 5,  days: 'Mon - Fri' },
        { id: '14', name: 'Thai Spice', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '11 AM - 11 PM', coupons: 3,  days: 'Mon - Fri' },
        { id: '15', name: 'Dim Sum Palace', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '10 AM - 10 PM', coupons: 2,  days: 'Mon - Fri' },
      ],
    },
    {
      id: '4',
      genre: 'Family & Group Deals',
      restaurants: [
        { id: '16', name: 'Falafel House', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '9 AM - 9 PM', coupons: 3,  days: 'Mon - Fri' },
        { id: '17', name: 'Shawarma Shack', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '10 AM - 11 PM', coupons: 4,  days: 'Mon - Fri' },
        { id: '18', name: 'Pita Paradise', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '11 AM - 10 PM', coupons: 2,  days: 'Mon - Fri' },
        { id: '19', name: 'Hummus & Co.', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '12 PM - 11 PM', coupons: 5,  days: 'Mon - Fri' },
        { id: '20', name: 'Kabob King', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '1 PM - 10 PM', coupons: 1,  days: 'Mon - Fri' },
      ],
    },
    {
      id: '5',
      genre: 'New on BogoNinja',
      restaurants: [
        { id: '21', name: 'Curry Delight', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '10 AM - 11 PM', coupons: 5, days: 'Mon - Fri' },
        { id: '22', name: 'Tandoori Palace', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '11 AM - 10 PM', coupons: 3,  days: 'Mon - Fri' },
        { id: '23', name: 'Biryani Bowl', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '12 PM - 12 AM', coupons: 4,  days: 'Mon - Fri' },
        { id: '24', name: 'Spice Junction', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '9 AM - 10 PM', coupons: 2,  days: 'Mon - Fri' },
        { id: '25', name: 'Masala Magic', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '10 AM - 10 PM', coupons: 1,  days: 'Mon - Fri' },
      ],
    },
    {
      id: '6',
      genre: 'Expiring Soon',
      restaurants: [
        { id: '26', name: 'Burger Mania', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '10 AM - 11 PM', coupons: 3,  days: 'Mon - Fri' },
        { id: '27', name: 'Cheesy Buns', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '11 AM - 10 PM', coupons: 2,  days: 'Mon - Fri' },
        { id: '28', name: 'Beefy Bliss', image: 'https://via.placeholder.com/150', isFavorite: true, hours: '12 PM - 12 AM', coupons: 5, days: 'Mon - Fri' },
        { id: '29', name: 'Vegan Burger Bar', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '9 AM - 10 PM', coupons: 1, days: 'Mon - Fri' },
        { id: '30', name: 'Double Patty', image: 'https://via.placeholder.com/150', isFavorite: false, hours: '10 AM - 10 PM', coupons: 2 , days: 'Mon - Fri'},
      ],
    },
  ];
  export default genres;
