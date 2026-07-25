Feature: Home page
  As a visitor
  I want to see the latest blog posts on the home page
  So that I can find something to read

  Scenario: Viewing the latest posts
    Given I am on the home page
    Then I should see 5 post previews
    And the first post should be "Shipping Fast Without Breaking Architecture"

  Scenario: Navigating to a post from the home page
    Given I am on the home page
    When I click on the post titled "Shipping Fast Without Breaking Architecture"
    Then I should be on the post page for "shipping-fast-without-breaking-architecture"
    And I should see the heading "Shipping Fast Without Breaking Architecture"

  Scenario: Paginating to the next page of posts
    Given I am on the home page
    When I go to page "2" of the posts
    Then I should see 5 post previews
    And the first post should be "Automating Commit Messages with Husky"
