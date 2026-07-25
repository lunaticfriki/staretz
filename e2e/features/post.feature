Feature: Post page
  As a visitor
  I want to read a full blog post
  So that I can learn about the topic

  Scenario: Viewing an existing post
    Given I am on the post page for "hexagonal-architecture-explained"
    Then I should see the heading "Hexagonal Architecture Explained"
    And I should see the text "Marco Reyes"

  Scenario: Visiting a post that does not exist
    Given I am on the post page for "does-not-exist"
    Then I should see the heading "Article no trobat"
