export const articles = [
  {
    slug: "jwt-authentication-in-aspnet-core-complete-guide",
    title: "JWT Authentication in ASP.NET Core: Complete Guide",
    category: ".NET",
    date: "Feb 8, 2026",
    readTime: "12 min read",
    excerpt: "Implement secure JWT login, token validation, and role-based authorization in a clean way.",
    content: [
      {
        heading: "Authentication Flow Design",
        paragraphs: [
          "A good JWT flow starts with a clear boundary between identity verification and token issuance.",
          "Your login endpoint should validate credentials, resolve user roles/permissions, and only then mint a short-lived access token."
        ],
        keyPoints: [
          "Use separate DTOs for login request/response.",
          "Never include sensitive data in token payload.",
          "Add role claims only if your authorization layer actually consumes them."
        ],
        codeSamples: [
          {
            title: "Token generation service",
            language: "csharp",
            code: `public string GenerateToken(User user)
{
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _jwt.Issuer,
        audience: _jwt.Audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(_jwt.ExpirationMinutes),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}`
          }
        ]
      },
      {
        heading: "Middleware and Validation",
        paragraphs: [
          "JWT validation must be strict in production: validate issuer, audience, signature, and token lifetime.",
          "If your API powers multiple clients, keep audience values explicit instead of broad wildcards."
        ],
        codeSamples: [
          {
            title: "JWT bearer setup",
            language: "csharp",
            code: `builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
        };
    });`
          }
        ]
      },
      {
        heading: "Authorization Patterns",
        paragraphs: [
          "Treat authorization as policy, not a route-level afterthought. Keep rules centralized and testable.",
          "For enterprise APIs, prefer named policies with requirements over scattered inline role checks."
        ]
      }
    ]
  },
  {
    slug: "react-performance-optimization-checklist",
    title: "React Performance Optimization Checklist",
    category: "Frontend",
    date: "Feb 6, 2026",
    readTime: "11 min read",
    excerpt: "A practical checklist for memoization, lazy loading, and reducing avoidable re-renders.",
    content: [
      {
        heading: "Find Real Bottlenecks",
        paragraphs: [
          "Profile first. React apps usually slow down from unnecessary renders and oversized component trees.",
          "Use the React Profiler flame graph to detect repeated renders of large lists and expensive parent components."
        ],
        keyPoints: [
          "Start with interaction traces: search, filtering, typing, navigation.",
          "Measure render counts before and after each optimization.",
          "Avoid premature memoization everywhere."
        ]
      },
      {
        heading: "Memoization That Helps",
        paragraphs: [
          "Memoization is effective when recomputation is expensive and dependency arrays are stable.",
          "If object props are recreated each render, `React.memo` gains disappear."
        ],
        codeSamples: [
          {
            title: "Stable callbacks and computed values",
            language: "jsx",
            code: `const filteredUsers = useMemo(
  () => users.filter((u) => u.name.toLowerCase().includes(searchTerm)),
  [users, searchTerm]
);

const handleSelect = useCallback((id) => {
  setSelectedId(id);
}, []);

return <UserList users={filteredUsers} onSelect={handleSelect} />;`
          }
        ]
      },
      {
        heading: "Rendering Large Lists",
        paragraphs: [
          "Virtualize long lists so the DOM only mounts visible rows. This has immediate impact on memory and paint time.",
          "Pair virtualization with debounced filtering for smooth UX under heavy datasets."
        ],
        codeSamples: [
          {
            title: "Virtualized list example",
            language: "jsx",
            code: `import { FixedSizeList as List } from "react-window";

<List height={480} itemCount={items.length} itemSize={48} width="100%">
  {({ index, style }) => <Row style={style} item={items[index]} />}
</List>;`
          }
        ]
      }
    ]
  },
  {
    slug: "rest-api-versioning-strategies-that-scale",
    title: "REST API Versioning Strategies That Scale",
    category: "Backend",
    date: "Feb 4, 2026",
    readTime: "10 min read",
    excerpt: "Compare URI, header, and query versioning with tradeoffs you should know before adopting one.",
    content: [
      {
        heading: "Choosing a Versioning Strategy",
        paragraphs: [
          "URI versioning is explicit for consumers and easiest to debug in logs and gateways.",
          "Header versioning keeps URLs clean but makes testing harder for less experienced teams."
        ],
        keyPoints: [
          "Use one strategy consistently across your API surface.",
          "Document default version behavior and sunset policy.",
          "Avoid hidden breaking changes in minor releases."
        ]
      },
      {
        heading: "Implementation Example",
        paragraphs: [
          "In ASP.NET Core, built-in API versioning libraries let you map controller actions cleanly by version.",
          "This keeps backward compatibility without bloating one controller with conditional logic."
        ],
        codeSamples: [
          {
            title: "Versioned controllers",
            language: "csharp",
            code: `[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/orders")]
public class OrdersV1Controller : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("v1");
}

[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/orders")]
public class OrdersV2Controller : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { message = "v2 with new fields" });
}`
          }
        ]
      },
      {
        heading: "Deprecation and Migration",
        paragraphs: [
          "Versioning fails when teams skip migration planning. Publish a changelog and hard dates for retirement.",
          "Track per-version traffic to make deprecation decisions based on usage, not assumptions."
        ]
      }
    ]
  },
  {
    slug: "how-to-design-idempotent-payment-apis",
    title: "How to Design Idempotent Payment APIs",
    category: "Architecture",
    date: "Feb 2, 2026",
    readTime: "12 min read",
    excerpt: "Design resilient APIs for retries, duplicate requests, and safe transaction handling.",
    content: [
      {
        heading: "Idempotency Fundamentals",
        paragraphs: [
          "Payment APIs must tolerate retries from clients, proxies, and network failures.",
          "Idempotency key design should bind one business intent to one persisted outcome."
        ],
        keyPoints: [
          "Require an `Idempotency-Key` header.",
          "Store request fingerprint + response payload.",
          "Reject same key with a different payload."
        ]
      },
      {
        heading: "Server-side Handling",
        paragraphs: [
          "On incoming request, lookup by key. If found, return stored response immediately.",
          "If key is new, process transaction and persist canonical response atomically."
        ],
        codeSamples: [
          {
            title: "Idempotent payment endpoint flow",
            language: "csharp",
            code: `var key = Request.Headers["Idempotency-Key"].ToString();
var existing = await _repo.FindByKeyAsync(key);
if (existing is not null)
{
    return StatusCode(existing.StatusCode, existing.BodyJson);
}

var result = await _paymentService.ChargeAsync(request);
await _repo.SaveAsync(key, request, result.StatusCode, result.BodyJson);

return StatusCode(result.StatusCode, result.BodyJson);`
          }
        ]
      },
      {
        heading: "Failure Modes and Recovery",
        paragraphs: [
          "Handle in-flight duplicates with short locks or optimistic conflict constraints on the idempotency key.",
          "Store deterministic error responses too, so retries stay behaviorally stable."
        ]
      }
    ]
  },
  {
    slug: "top-sql-query-patterns-every-developer-should-know",
    title: "Top SQL Query Patterns Every Developer Should Know",
    category: "Database",
    date: "Jan 30, 2026",
    readTime: "11 min read",
    excerpt: "Use practical SQL patterns for reporting, pagination, joins, and performance-sensitive queries.",
    content: [
      {
        heading: "Query Shape and Index Use",
        paragraphs: [
          "Most SQL performance wins come from query/index alignment, not micro-optimizations.",
          "Select only required columns and constrain rows early to reduce IO."
        ],
        codeSamples: [
          {
            title: "Covering query pattern",
            language: "sql",
            code: `SELECT order_id, customer_id, total_amount
FROM orders
WHERE customer_id = @customerId
  AND created_at >= @fromDate
ORDER BY created_at DESC
LIMIT 50;`
          }
        ]
      },
      {
        heading: "Keyset Pagination",
        paragraphs: [
          "Offset pagination gets slower on deep pages because the database must skip rows.",
          "Keyset pagination scales better for timeline and activity feeds."
        ],
        codeSamples: [
          {
            title: "Keyset pagination query",
            language: "sql",
            code: `SELECT id, title, created_at
FROM posts
WHERE created_at < @lastSeenCreatedAt
ORDER BY created_at DESC
LIMIT 20;`
          }
        ]
      },
      {
        heading: "Debugging Slow SQL",
        paragraphs: [
          "Use execution plans to verify index usage and detect table scans.",
          "Tune one query at a time and validate with production-like data volumes."
        ]
      }
    ]
  },
  {
    slug: "nodejs-error-handling-patterns-for-production-apps",
    title: "Node.js Error Handling Patterns for Production Apps",
    category: "Backend",
    date: "Jan 27, 2026",
    readTime: "10 min read",
    excerpt: "Centralized error middleware, structured logging, and clean failure responses for APIs.",
    content: [
      {
        heading: "Centralize Errors in Middleware",
        paragraphs: [
          "Express apps should route operational and validation failures through a single middleware.",
          "This ensures stable error shape for clients and better observability."
        ],
        codeSamples: [
          {
            title: "Express error middleware",
            language: "javascript",
            code: `app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  logger.error({ err, path: req.path, traceId: req.id });
  res.status(status).json({
    code: err.code || "UNEXPECTED_ERROR",
    message: err.publicMessage || "Something went wrong",
    traceId: req.id
  });
});`
          }
        ]
      },
      {
        heading: "Error Taxonomy",
        paragraphs: [
          "Classify errors into validation, auth, dependency, and unexpected categories.",
          "Consistent categories make dashboards and alerting much more actionable."
        ],
        keyPoints: [
          "4xx for client mistakes, 5xx for server/dependency failures.",
          "Attach correlation/trace IDs to all logs and responses.",
          "Avoid leaking stack traces to public clients."
        ]
      },
      {
        heading: "Crash Handling Strategy",
        paragraphs: [
          "For fatal process-level errors, log context and exit gracefully so orchestration can restart.",
          "Do not keep unhealthy process state alive after uncaught exceptions."
        ]
      }
    ]
  },
  {
    slug: "system-design-building-a-url-shortener",
    title: "System Design: Building a URL Shortener",
    category: "System Design",
    date: "Jan 24, 2026",
    readTime: "14 min read",
    excerpt: "Walk through data model, API design, caching, and scaling decisions for a common interview problem.",
    content: [
      {
        heading: "Requirements and Capacity",
        paragraphs: [
          "Start with APIs for short URL creation and redirect resolution. Add optional analytics and expiration policies.",
          "Estimate write/read ratio early. URL shorteners are usually read-heavy, which strongly influences architecture."
        ]
      },
      {
        heading: "Data Model and APIs",
        paragraphs: [
          "Store short code, long URL, created time, expiry, and owner context if needed.",
          "Use indexed lookup by short code for fast redirects."
        ],
        codeSamples: [
          {
            title: "Core endpoints",
            language: "http",
            code: `POST /api/shorten
{
  "longUrl": "https://example.com/article/123"
}

GET /r/{code} -> 302 redirect`
          }
        ]
      },
      {
        heading: "Scaling and Reliability",
        paragraphs: [
          "Add Redis caching for hot codes and async event ingestion for click analytics.",
          "Prevent abuse with rate limiting, block lists, and URL safety checks."
        ],
        codeSamples: [
          {
            title: "Redirect flow pseudocode",
            language: "text",
            code: `if cache.contains(code): return redirect(cache.get(code))
url = db.findByCode(code)
if url is null: return 404
cache.set(code, url, ttl=10m)
publishClickEvent(code)
return redirect(url)`
          }
        ]
      }
    ]
  },
  {
    slug: "how-to-prepare-for-backend-developer-interviews",
    title: "How to Prepare for Backend Developer Interviews",
    category: "Interview Prep",
    date: "Jan 20, 2026",
    readTime: "11 min read",
    excerpt: "A focused roadmap on DSA, APIs, databases, and real scenario problem-solving.",
    content: [
      {
        heading: "Preparation Framework",
        paragraphs: [
          "Use a weekly split: data structures/algorithms, backend fundamentals, and mock interviews.",
          "The goal is not memorization; it is the ability to explain technical decisions clearly."
        ],
        keyPoints: [
          "Allocate fixed daily practice blocks.",
          "Track weak areas in a running log.",
          "Revisit failed problems after 72 hours."
        ]
      },
      {
        heading: "Project Storytelling",
        paragraphs: [
          "Interviewers often probe real work. Prepare two detailed project stories with architecture and tradeoffs.",
          "Focus on constraints, incidents, metrics, and what you changed."
        ],
        codeSamples: [
          {
            title: "Project answer structure",
            language: "text",
            code: `1) Problem context and constraints
2) Initial architecture and bottleneck
3) Decision options evaluated
4) Implemented change and rollout
5) Outcome metrics and lessons learned`
          }
        ]
      },
      {
        heading: "Backend Topics to Master",
        paragraphs: [
          "Strong candidates can reason about transactions, indexing, caching, distributed consistency, and API security.",
          "Practice designing one service end-to-end with auth, observability, and deployment considerations."
        ]
      }
    ]
  },
  {
    slug: "cicd-for-full-stack-apps-beginner-friendly-workflow",
    title: "CI/CD for Full-Stack Apps: A Beginner-Friendly Workflow",
    category: "DevOps",
    date: "Jan 16, 2026",
    readTime: "10 min read",
    excerpt: "Set up build, test, and deployment pipelines with confidence and reliable release habits.",
    content: [
      {
        heading: "Pipeline Stages That Matter",
        paragraphs: [
          "A reliable pipeline has deterministic steps: lint, test, build, security checks, and deploy.",
          "Avoid huge monolithic workflows; split jobs so failures are easy to diagnose."
        ],
        codeSamples: [
          {
            title: "Basic CI workflow",
            language: "yaml",
            code: `name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`
          }
        ]
      },
      {
        heading: "Deployment Discipline",
        paragraphs: [
          "Promote artifacts across environments instead of rebuilding differently each stage.",
          "Use health checks and rollback hooks so failed releases recover quickly."
        ],
        keyPoints: [
          "Keep secrets in vault/environment providers.",
          "Run database migrations with explicit approvals.",
          "Tag successful deployments for incident traceability."
        ]
      },
      {
        heading: "Developer Productivity",
        paragraphs: [
          "Fast pipelines help teams ship more often. Cache dependencies and parallelize independent steps.",
          "Use preview environments for pull requests to reduce feedback loops."
        ]
      }
    ]
  },
  {
    slug: "understanding-caching-redis-patterns-youll-actually-use",
    title: "Understanding Caching: Redis Patterns You’ll Actually Use",
    category: "Backend",
    date: "Jan 12, 2026",
    readTime: "10 min read",
    excerpt: "Learn cache-aside, TTL tuning, and invalidation patterns for faster and safer systems.",
    content: [
      {
        heading: "Cache-aside in Practice",
        paragraphs: [
          "Cache-aside is simple: read cache, fallback to DB, then populate cache.",
          "It works well for read-heavy endpoints and avoids coupling DB writes directly to cache updates."
        ],
        codeSamples: [
          {
            title: "Cache-aside service method",
            language: "csharp",
            code: `var key = $"product:{id}";
var cached = await _redis.GetStringAsync(key);
if (!string.IsNullOrEmpty(cached))
{
    return JsonSerializer.Deserialize<ProductDto>(cached)!;
}

var product = await _repo.GetByIdAsync(id);
await _redis.SetStringAsync(key, JsonSerializer.Serialize(product),
    new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });
return product;`
          }
        ]
      },
      {
        heading: "TTL and Invalidation",
        paragraphs: [
          "TTL should align with data volatility and user tolerance for stale responses.",
          "For critical data, invalidate on write or publish invalidation events."
        ],
        keyPoints: [
          "Short TTL for volatile pricing/inventory.",
          "Longer TTL for reference data.",
          "Track stale-read impact explicitly."
        ]
      },
      {
        heading: "Observability and Guardrails",
        paragraphs: [
          "Monitor hit ratio, miss penalty, eviction pressure, and cache latency.",
          "Always keep DB fallback healthy; cache is performance optimization, not source of truth."
        ]
      }
    ]
  },
  {
    slug: "pascals-triangle",
    title: "Pascal's Triangle",
    category: "Algorithms",
    date: "Sep 22, 2023",
    readTime: "7 min read",
    excerpt: "Generate the first n rows of Pascal's Triangle using previous-row construction with O(n^2) time complexity.",
    content: [
      {
        heading: "Problem Statement",
        paragraphs: [
          "Given an integer n, generate the first n rows of Pascal's Triangle as a list of lists.",
          "Each row starts and ends with 1, and every inner value is the sum of two values from the previous row."
        ],
        keyPoints: [
          "Row 0 is [1].",
          "For row i, elements at index 0 and i are always 1.",
          "For inner index j, value = prev[j - 1] + prev[j]."
        ]
      },
      {
        heading: "Approach and Intuition",
        paragraphs: [
          "Build rows one by one. Keep a reference to the previous row and use it to compute the current row.",
          "This avoids combinatorics and keeps implementation straightforward for interviews and coding tests."
        ],
        codeSamples: [
          {
            title: "Java implementation",
            language: "java",
            code: `import java.util.ArrayList;
import java.util.List;

public class PascalTriangle {
    public static List<List<Integer>> generate(int n) {
        List<List<Integer>> ans = new ArrayList<>();
        List<Integer> prev = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) {
                    row.add(1);
                } else {
                    row.add(prev.get(j - 1) + prev.get(j));
                }
            }
            ans.add(row);
            prev = row;
        }

        return ans;
    }

    public static void main(String[] args) {
        int n = 5;
        System.out.println(generate(n));
    }
}`
          },
          {
            title: "C# implementation",
            language: "csharp",
            code: `using System;
using System.Collections.Generic;

public class PascalTriangle
{
    public static List<List<int>> Generate(int n)
    {
        var ans = new List<List<int>>();
        var prev = new List<int>();

        for (int i = 0; i < n; i++)
        {
            var row = new List<int>();
            for (int j = 0; j <= i; j++)
            {
                if (j == 0 || j == i)
                {
                    row.Add(1);
                }
                else
                {
                    row.Add(prev[j - 1] + prev[j]);
                }
            }

            ans.Add(row);
            prev = row;
        }

        return ans;
    }

    public static void Main()
    {
        var result = Generate(5);
        foreach (var row in result)
        {
            Console.WriteLine(string.Join(" ", row));
        }
    }
}`
          }
        ]
      },
      {
        heading: "Complexity Analysis",
        paragraphs: [
          "Time complexity is O(n^2) because we fill approximately n(n+1)/2 cells.",
          "Space complexity is O(n^2) for storing all rows in the output triangle."
        ]
      }
    ]
  }
];

export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug) || null;
}
