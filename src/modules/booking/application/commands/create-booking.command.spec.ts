import { CreateBookingCommand } from './create-booking.command';

describe('CreateBookingCommand', () => {
  it('should be defined', () => {
    expect(new CreateBookingCommand()).toBeDefined();
  });
});
