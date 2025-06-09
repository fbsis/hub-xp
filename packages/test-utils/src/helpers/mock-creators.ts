export class MockCreators {
  static createServiceMock(methods: string[]) {
    const mock: any = {};
    methods.forEach(method => {
      mock[method] = { mockResolvedValue: () => {}, mockRejectedValue: () => {} };
    });
    return mock;
  }

  static createRepositoryMock(methods: string[]) {
    const mock: any = {};
    methods.forEach(method => {
      mock[method] = { mockResolvedValue: () => {}, mockRejectedValue: () => {} };
    });
    return mock;
  }

  static bookServiceMethods = [
    'create',
    'seedDatabase', 
    'findAll',
    'findOne',
    'update',
    'remove',
    'getTopRated'
  ];

  static reviewServiceMethods = [
    'create',
    'findAll',
    'findByBook',
    'findOne',
    'update',
    'remove'
  ];

  static bookRepositoryMethods = [
    'create',
    'seedBooks',
    'findAll',
    'findById',
    'update',
    'delete',
    'getTopRated',
    'exists'
  ];

  static reviewRepositoryMethods = [
    'create',
    'findAll',
    'findByBook',
    'findById',
    'update',
    'delete'
  ];

  static bookServiceMock() {
    return MockCreators.createServiceMock(MockCreators.bookServiceMethods);
  }

  static reviewServiceMock() {
    return MockCreators.createServiceMock(MockCreators.reviewServiceMethods);
  }

  static bookRepositoryMock() {
    return MockCreators.createRepositoryMock(MockCreators.bookRepositoryMethods);
  }

  static reviewRepositoryMock() {
    return MockCreators.createRepositoryMock(MockCreators.reviewRepositoryMethods);
  }
} 