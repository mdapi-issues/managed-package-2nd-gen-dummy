@isTest
private class Test_GlobalGreeter {
  @isTest
  static void greet() {
    System.assertEquals(GlobalGreeter.greet('John'), 'Hi John');
  }
}
