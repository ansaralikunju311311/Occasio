export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGNUP: '/auth/signup',
  AUTH_LOGIN: '/auth/login',
  AUTH_ADMIN_LOGIN: '/auth/admin/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  AUTH_RESEND_OTP: '/auth/resend-otp',
  AUTH_VERIFY_OTP: '/auth/verify-otp',
  AUTH_ME: '/auth/me',
  AUTH_UPDATE_PASSWORD: '/auth/updatepassword',
  AUTH_REFRESH: '/auth/refresh',

  // Events
  EVENTS: '/events/events',
  EVENT_DETAILS: (id: string) => `/events/eventDetails/${id}`,
  EVENT_CREATION: '/events/creation',
  EVENTS_ALL: '/events/allevents',
  EVENTS_MY: '/events/myevents',
  EVENT_UPDATE: (id: string) => `/events/update/${id}`,
  EVENT_DELETE: (id: string) => `/events/${id}`,

  // Payments & Bookings
  PAYMENTS_ORDER: '/payments/order',
  PAYMENTS_TICKET_ORDER: '/payments/ticket-order',
  PAYMENTS_PRICE_BREAKDOWN: '/payments/price-breakdown',
  PAYMENTS_MY_BOOKINGS: '/payments/my-bookings',
  PAYMENTS_MANAGER_BOOKINGS: '/payments/manager-bookings',
  PAYMENTS_VERIFY: '/payments/verify',
  PAYMENTS_SUBSCRIPTION_ORDER: '/payments/subscription-order',
  PAYMENTS_VERIFY_SUBSCRIPTION: '/payments/verify-subscription',

  // Bookings Locking / Lock seats
  BOOKINGS_LOCK_SEATS: '/bookings/lock-seats',
  BOOKINGS_PAYMENT_INTENT: '/bookings/payment-intent',
  BOOKINGS_CONFIRM: '/bookings/confirm',
  BOOKINGS_FAILED: '/bookings/failed',

  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAILS: (id: string) => `/admin/userDetails/${id}`,
  ADMIN_PENDING_MANAGERS: (id: string) => `/admin/pendingmanagers/${id}`,
  ADMIN_MANAGER_DETAILS: (id: string) => `/admin/managerDetails/${id}`,
  ADMIN_BLOCK_UNBLOCK: (id: string) => `/admin/blockorunblock/${id}`,
  ADMIN_APPROVE_MANAGER: (id: string) => `/admin/approval/${id}`,
  ADMIN_REJECT_MANAGER: (id: string) => `/admin/rejection/${id}`,
  ADMIN_PAYMENTS: '/admin/payments',

  // Subscription Plans
  PLANS_GET: '/plans/getplans',
  PLANS_CREATE: '/plans/createplans',
  PLANS_UPDATE: (id: string) => `/plans/updateplan/${id}`,

  // User
  USER_PROFILE: '/user/profile',
  USER_UPGRADE_ROLE: '/user/upgraderole',
  USER_REAPPLY: '/user/reapply',
};

export const APP_MESSAGES = {
  // Success Messages
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  SIGNUP_SUCCESS: 'Registered successfully. Please verify your email.',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  OTP_SENT_SUCCESS: 'Verification code sent to your email',
  OTP_VERIFIED_SUCCESS: 'Email verified successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  BOOKING_SUCCESS: 'Ticket booked successfully!',
  EVENT_CREATED: 'Event created successfully!',
  EVENT_UPDATED: 'Event updated successfully!',
  EVENT_DELETED: 'Event deleted successfully!',
  MANAGER_APPROVED: 'Manager request approved successfully',
  MANAGER_REJECTED: 'Manager request rejected successfully',
  USER_BLOCKED: 'User blocked successfully',
  USER_UNBLOCKED: 'User unblocked successfully',

  // Error Messages
  LOAD_EVENTS_FAILED: 'Could not load upcoming events',
  LOAD_EVENT_DETAILS_FAILED: 'Failed to retrieve event details',
  LOAD_BOOKINGS_FAILED: 'Could not load your bookings',
  ACTION_FAILED: 'An error occurred. Please try again.',
  LOCATION_NOT_SUPPORTED: 'Geolocation is not supported by your browser',
  LOCATION_DENIED: 'Permission to access location was denied',
  LOCATION_FAILED: 'Unable to retrieve location details',
  PAYMENT_CANCELLED: 'Payment cancelled by user',
  PAYMENT_FAILED: 'Payment verification failed',
  SEATS_LOCK_FAILED: 'Failed to lock seats. They might be already booked.',
};
