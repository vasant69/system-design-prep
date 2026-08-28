import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "authz-rpc-1",
    question:
      "Roles, policies aur claims me kya farak hai — kab kaunsa use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Role: fixed job-title rule jo shaayad hi badle. Claim-based policy: rule ek non-role attribute pe (dept, branch, plan). Custom requirement+handler: rule me logic ya reuse chahiye.",
    detailedAnswer:
      "Role ek simple label hai — `[Authorize(Roles = Admin)]` readable hai aur jab permission seedha designation se bandha ho tab best hai. Claim-based policy tab jab decision ek attribute pe ho jo role nahi hai — `RequireClaim(dept, HR)`. Custom `IAuthorizationRequirement` + `AuthorizationHandler` tab jab rule me actual logic ho (do values compare, DB lookup, same-branch check) ya wahi rule kai endpoints pe chahiye — poori C# logic ek jagah. Policy ka bada fayda: rule `Program.cs` me ek jagah, 30 attributes me nahi bikharta. Aur jab decision specific entity pe depend kare (sirf apna record) to resource-based `IAuthorizationService.AuthorizeAsync` — wo alag axis hai.",
    followUp:
      "Ek claim-based rule ko custom handler me kab convert karoge?",
    redFlag:
      "Ye kehna ki policy aur role bilkul same cheez hain, ya har rule ke liye hamesha custom handler banana.",
  },
  {
    id: "authz-rpc-2",
    question:
      "Ek policy me multiple requirements hon, aur ek requirement ke multiple handlers — ye kaise combine hote hain?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Requirements AND — sab satisfy hone chahiye. Ek requirement ke handlers OR — koi ek `context.Succeed(requirement)` kare to wo requirement met.",
    detailedAnswer:
      "Authorization middleware har requirement ke liye uske saare registered handlers ko `AuthorizationHandlerContext` deta hai. Agar us requirement ke liye koi bhi handler `context.Succeed(requirement)` call kar de, wo requirement satisfied maan liya jaata hai — yani OR. Policy tab pass hoti hai jab uske saare requirements satisfied hon — yani AND. Isse expressive combos ban jaate hain: ek requirement ke liye alag-alag conditions (kai handlers), aur ek policy me kai independent rules. `context.Fail()` bhi hai jo poori evaluation ko hard-fail kar deta hai chahe koi handler succeed kare — sirf tab use karo jab tumhe explicit veto chahiye.",
    followUp:
      "`context.Fail()` aur sirf `Succeed` na call karne me kya farak hai?",
  },
  {
    id: "authz-rpc-3",
    question:
      "Ye code padho. Iska output kya hoga jab ek HrManager (Admin nahi) apna hi record GET kare?\n```csharp\n[HttpGet(\"{id:int}\")]\npublic async Task<ActionResult<EmployeeDto>> GetById(int id)\n{\n    var e = await _employees.GetEntityByIdAsync(id);\n    if (e is null) return NotFound();\n    if (User.IsInRole(\"Admin\") || User.IsInRole(\"HrManager\"))\n        return Ok(_employees.ToDto(e));\n    var myId = User.FindFirstValue(\"employeeId\");\n    if (myId == e.Id.ToString()) return Ok(_employees.ToDto(e));\n    return Forbid();\n}\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "200 OK with the DTO — HrManager branch pehle match ho jaata hai, ownership check tak pahunchne ki zaroorat hi nahi padti.",
    detailedAnswer:
      "`User.IsInRole(HrManager)` true hai, to pehla `if` hi `Ok(...)` return kar deta hai — 200. Ownership wali line (`employeeId` claim compare) sirf tab chalti hai jab user na Admin ho na HrManager. Agar wahi user kisi doosre ka record maangta aur uske paas koi privileged role na hota, to `myId != e.Id` hone par `Forbid()` yani 403 milta. Record exist na kare to `NotFound()` 404 — dhyan do ye ownership check se pehle hai, to non-existent id pe sabko 404 dikhta hai.",
    followUp:
      "Security ke liye 403 ki jagah kab 404 return karna behtar hai?",
    redFlag:
      "Ye kehna ki ye check attribute se ho sakta tha — attribute ke paas entity (`e`) nahi hoti.",
  },
  {
    id: "authz-rpc-4",
    question:
      "Custom AuthorizationHandler likha, policy me requirement add kiya, phir bhi har request 403. Debug kaise karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Sabse pehle check karo ki handler DI me `AddScoped<IAuthorizationHandler, TheHandler>()` se registered hai — 90% baar yahi missing hota hai.",
    detailedAnswer:
      "Handler agar DI me register na ho to wo kabhi instantiate hota hi nahi, requirement kabhi `Succeed` nahi hota, aur authorization default-deny hone ki wajah se 403 milta hai — bina kisi exception ya log ke. Steps: (1) `Program.cs` me handler ki `IAuthorizationHandler` registration line dhundo; (2) handler ke andar breakpoint ya log lagao — hit ho raha hai ya nahi; (3) hit ho raha hai par `Succeed` nahi — to condition (claim missing? role type mismatch? `branch` claim token me hai?) check karo; (4) do-arg `AuthorizationHandler<TReq, TResource>` hai to wo sirf resource-based `AuthorizeAsync(User, resource, policy)` call se trigger hota hai, plain `[Authorize(Policy)]` se nahi.",
    followUp:
      "Do-arg handler ko plain `[Authorize(Policy = ...)]` se trigger kyun nahi hota?",
    redFlag:
      "Seedha `ValidateIssuer`/policy config ko blame karna bina handler registration check kiye.",
  },
  {
    id: "authz-rpc-5",
    question:
      "Hamare EmployeeManagement.Api me tum endpoints kaise lock karoge — kaunsa verb kaunsa rule?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Class-level `[Authorize]` baseline; `GET` open to any authenticated user; `POST`/`PUT` need a `CanManageEmployees` policy (Admin ya HrManager); `DELETE` needs Admin.",
    detailedAnswer:
      "`EmployeesController` pe class-level `[Authorize]` — koi bhi anonymous andar nahi. `GET` (list aur by-id) pe kuch extra nahi, par by-id pe resource-based check taaki non-privileged user sirf apna record dekhe. `POST` aur `PUT` pe `[Authorize(Policy = CanManageEmployees)]`, jahan policy `Program.cs` me `RequireRole(Admin, HrManager)` se bani. `DELETE` pe `[Authorize(Roles = Admin)]` — chhota fixed rule, policy banana over-engineering. `AuthController.Login`/register pe `[AllowAnonymous]`. Health check bhi `[AllowAnonymous]`. Isse read mostly-open, writes role-gated, aur destructive op sabse tight.",
    followUp:
      "`POST` ke liye policy aur `DELETE` ke liye seedha `Roles` — dono alag kyun rakhe?",
  },
  {
    id: "authz-rpc-6",
    question:
      "Resource-based authorization kya hai aur wo attribute-based se kaise alag hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Jab decision specific entity pe depend kare (jaise ownership), to check action ke andar `IAuthorizationService.AuthorizeAsync(User, entity, policy)` se hota hai, attribute se nahi.",
    detailedAnswer:
      "`[Authorize(Policy = ...)]` request ke shuru me chalta hai — us waqt entity load hi nahi hui, to entity pe depend karne wala rule (sirf apna record, same branch, apni city) attribute me express nahi ho sakta. Resource-based me tum action me entity fetch karte ho, phir `var result = await _authz.AuthorizeAsync(User, employee, policyName);` call karte ho — `employee` handler ke `resource` parameter me pahunchta hai. `result.Succeeded` false pe `Forbid()`. Handler `AuthorizeAsync` ka overload lene ke liye `AuthorizationHandler<TRequirement, TResource>` hona chahiye. Ye clean bhi hai aur unit-testable bhi — handler ko manually banaye `AuthorizationHandlerContext` ke saath test kar sakte ho.",
    followUp:
      "Ek hi handler class me plain aur resource-based dono support karna ho to?",
    redFlag:
      "Ownership check ko controller ke bahar, ek plain policy attribute me daalne ki koshish.",
  },
  {
    id: "authz-rpc-7",
    question:
      "Kya ye sahi hai: 'Har endpoint pe `[Authorize(Roles = ...)]` likh do, policies extra complexity hain'?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Chhote fixed rules ke liye theek, par blanket statement galat — rule badalne pe har attribute edit karna padta hai aur ek jagah bhoolna hole ban jaata hai.",
    detailedAnswer:
      "Agar rule sach me ek fixed role hai jo 2-3 jagah use hota hai (`DELETE` = Admin), to `Roles = Admin` readable aur theek hai. Par jaise hi rule kai endpoints pe repeat hota hai ya usme logic aati hai, inline roles ek maintenance aur security problem ban jaate hain: `Admin,HrManager` ko `Admin,HrManager,HrLead` karna hai to har attribute dhoondo; ek miss = privilege gap. Named policy rule ko `Program.cs` me ek jagah rakhti hai, testable banati hai, aur `RequireClaim`/custom handler tak scale karti hai. Context-dependent judgment: chhote app me over-engineer mat karo, growing app me policy default rakho.",
    redFlag:
      "Bina caveat ke 'policies hamesha better' ya 'policies kabhi zaroori nahi' — dono extreme.",
  },
  {
    id: "authz-rpc-8",
    question:
      "JWT me role kaise aata hai, aur `[Authorize(Roles = ...)]` ko wo role kaise dikhta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Login pe `new Claim(ClaimTypes.Role, user.Role)` token me jaata hai; JwtBearer me `RoleClaimType` isi ko role samajhta hai, phir `User.IsInRole` aur `Roles = ...` kaam karte hain.",
    detailedAnswer:
      "Token issue karte waqt tum role ko ek claim ki tarah daalte ho. JWT payload me wo aksar `role` ya ek schema URI (`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`) key se aata hai. `AddJwtBearer` ke `TokenValidationParameters.RoleClaimType` (default `ClaimTypes.Role`) batata hai kaunsa claim role hai. Iske baad `User.IsInRole(Admin)`, `[Authorize(Roles = Admin)]`, aur `RequireRole(Admin)` sab isi claim ko dekhte hain. Agar role match nahi ho raha, 99% baar claim type mismatch hai — token me key alag hai aur `RoleClaimType` set nahi kiya. Zaroori: role hamesha signed token se aana chahiye, kabhi request body/query se nahi.",
    followUp:
      "Agar token me multiple role claims hain to `IsInRole` kaise behave karta hai?",
    redFlag:
      "Role ko request body ke ek field se padhna aur us pe authorize karna.",
  },
  {
    id: "authz-rpc-9",
    question:
      "Ek `MinimumDepartmentLevelRequirement(int level)` jaisa data-carrying requirement + handler likho.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Requirement class me `Level` property; handler `AuthorizationHandler<T>` extend karke `context.User` ke `level` claim ko requirement ke value se compare kare aur pass hone pe `context.Succeed`.",
    detailedAnswer:
      "```csharp\npublic sealed class MinimumDepartmentLevelRequirement : IAuthorizationRequirement\n{\n    public int Level { get; }\n    public MinimumDepartmentLevelRequirement(int level) => Level = level;\n}\n\npublic sealed class MinimumDepartmentLevelHandler\n    : AuthorizationHandler<MinimumDepartmentLevelRequirement>\n{\n    protected override Task HandleRequirementAsync(\n        AuthorizationHandlerContext context,\n        MinimumDepartmentLevelRequirement requirement)\n    {\n        var raw = context.User.FindFirst(\"level\")?.Value;\n        if (int.TryParse(raw, out var level) && level >= requirement.Level)\n            context.Succeed(requirement);\n        return Task.CompletedTask;\n    }\n}\n\n// Program.cs\noptions.AddPolicy(\"SeniorStaff\", p =>\n    p.Requirements.Add(new MinimumDepartmentLevelRequirement(3)));\nbuilder.Services.AddScoped<IAuthorizationHandler, MinimumDepartmentLevelHandler>();\n```\nKey points: requirement immutable data rakhta hai, handler DI-registered hai, `context.Succeed` na call karne par requirement apne aap fail, aur claim parse fail hone par bhi safe (deny by default).",
    followUp:
      "Isi policy ke liye ek doosra handler add karke 'ya to level 3+ ya role Admin' kaise banaoge?",
  },
];

export default questions;
