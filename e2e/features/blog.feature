Feature: Blog listing page
  As a visitor
  I want to browse all blog posts with pagination
  So that I can find older articles too

  Scenario: Viewing the first page of posts
    Given I am on the blog page
    Then I should see the heading "Blog"
    And I should see 5 post previews
    And the first post should be "Shipping Fast Without Breaking Architecture"

  Scenario: Paginating to the next page of posts
    Given I am on the blog page
    When I go to page "2" of the posts
    Then I should see 5 post previews
    And the first post should be "Automating Commit Messages with Husky"

  Scenario: Navigating to a post from the blog page
    Given I am on the blog page
    When I click on the post titled "Shipping Fast Without Breaking Architecture"
    Then I should be on the post page for "shipping-fast-without-breaking-architecture"
    And I should see the heading "Shipping Fast Without Breaking Architecture"
