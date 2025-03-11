/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcryptjs';

export const UsersSeed = async () => {
  return [
    {
      name: 'Pedro Junior',
      email: 'pedro.junior@gmail.com',
      user: 'PJ_SILVA',
      password: await bcrypt.hash('#Pj123456', await bcrypt.genSalt()),
      document: '37893832878',
      role: 2,
    },
    {
      name: 'João Paulo Moura',
      email: 'joaopaulo92803693@gmail.com',
      user: 'JP_MOURA',
      password: await bcrypt.hash('#Jp123456', await bcrypt.genSalt()),
      document: '00000000000',
      role: 2,
    },
  ];
};
