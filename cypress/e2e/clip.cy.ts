describe("Clip", () => {
  it("should play clip", () => {
    cy.visit("/");
    cy.get("app-clips-list > .grid a:first").click();
    cy.get(".video-js").click();
    cy.wait(5000);
    cy.get(".video-js").click();
    cy.get(".vjs-play-progress").invoke('width').should("be.gte", 0);
  });
});
