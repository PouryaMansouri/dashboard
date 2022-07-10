import mock from '@/@fake-db/mock'
/* eslint-disable global-require */
const data = {
  accountSetting: {
    general: {
      avatar: require('@/assets/images/avatars/blank.png'),
      username: 'emadmirzaie',
      name: 'عماد میرزایی',
      email: 'emad@gmail.com',
      company: '',
    },
    info: {
      bio: '',
      dob: null,
      country: 'USA',
      website: '',
      phone: '09367390697',
    },
    social: {
      socialLinks: {
        twitter: 'https://www.twitter.com',
        facebook: '',
        google: '',
        linkedIn: 'https://www.linkedin.com',
        instagram: '',
        quora: '',
      },
      connections: {
        twitter: {
          profileImg: require('@/assets/images/avatars/11-small.png'),
          id: 'johndoe',
        },
        google: {
          profileImg: require('@/assets/images/avatars/3-small.png'),
          id: 'luraweber',
        },
        facebook: {},
        github: {},
      },
    },
    notification: {
      commentOnArticle: true,
      AnswerOnForm: true,
      followMe: false,
      newAnnouncements: true,
      productUpdates: true,
      blogDigest: false,
    },
  },
}
/* eslint-disable global-require */
mock.onGet('/account-setting/data').reply(() => [200, data.accountSetting])
