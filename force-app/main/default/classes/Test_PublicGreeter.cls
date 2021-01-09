@isTest
private class Test_PublicGreeter {
  @isTest
  static void greet() {
    System.assertEquals(PublicGreeter.greet('John'), 'Hello John');
  }
}
