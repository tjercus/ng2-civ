describe("Home", () => {

  beforeEach( () => {
    browser.get("/");
  });

  it("should have a header", () => {
    expect(element(by.css("h1")).getText()).toEqual("World in year 1");
  });

  it("should have a board", () => {
    expect(element(by.css("#board-table")).isPresent());
  });

  // ex:
    //element(by.css("sd-home form input")).sendKeys("Tim Berners-Lee");
    //element(by.css("sd-home form button")).click();
});
