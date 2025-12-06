/**
 * ShareButtons 컴포넌트 테스트
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShareButtons from "@/app/components/ShareButtons";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock siteConfig
jest.mock("@/lib/siteConfig", () => ({
  siteConfig: {
    url: "https://example.com",
    name: "Test Blog",
    author: { name: "Test Author" },
  },
}));

describe("ShareButtons", () => {
  const defaultProps = {
    title: "Test Post Title",
    slug: "test-post",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders share label", () => {
    render(<ShareButtons {...defaultProps} />);
    expect(screen.getByText("공유하기")).toBeInTheDocument();
  });

  it("renders Twitter share button", () => {
    render(<ShareButtons {...defaultProps} />);
    const twitterButton = screen.getByLabelText("Twitter에 공유");
    expect(twitterButton).toBeInTheDocument();
    expect(twitterButton).toHaveAttribute("href");
    expect(twitterButton.getAttribute("href")).toContain("twitter.com");
  });

  it("renders Facebook share button", () => {
    render(<ShareButtons {...defaultProps} />);
    const facebookButton = screen.getByLabelText("Facebook에 공유");
    expect(facebookButton).toBeInTheDocument();
    expect(facebookButton.getAttribute("href")).toContain("facebook.com");
  });

  it("renders LinkedIn share button", () => {
    render(<ShareButtons {...defaultProps} />);
    const linkedInButton = screen.getByLabelText("LinkedIn에 공유");
    expect(linkedInButton).toBeInTheDocument();
    expect(linkedInButton.getAttribute("href")).toContain("linkedin.com");
  });

  it("renders copy link button", () => {
    render(<ShareButtons {...defaultProps} />);
    const copyButton = screen.getByLabelText("링크 복사");
    expect(copyButton).toBeInTheDocument();
  });

  it("copies link to clipboard when copy button clicked", async () => {
    render(<ShareButtons {...defaultProps} />);
    const copyButton = screen.getByLabelText("링크 복사");

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "https://example.com/posts/test-post"
      );
    });
  });

  it("shows copied feedback after copying", async () => {
    render(<ShareButtons {...defaultProps} />);
    const copyButton = screen.getByLabelText("링크 복사");

    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText("복사됨!")).toBeInTheDocument();
    });
  });

  it("share links open in new tab", () => {
    render(<ShareButtons {...defaultProps} />);
    const twitterButton = screen.getByLabelText("Twitter에 공유");
    expect(twitterButton).toHaveAttribute("target", "_blank");
    expect(twitterButton).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("encodes title and url in share links", () => {
    const props = {
      title: "Test Title with Spaces & Special",
      slug: "test-slug",
    };
    render(<ShareButtons {...props} />);

    const twitterButton = screen.getByLabelText("Twitter에 공유");
    const href = twitterButton.getAttribute("href") || "";

    // Check that the title is URL encoded
    expect(href).toContain(encodeURIComponent(props.title));
  });
});
