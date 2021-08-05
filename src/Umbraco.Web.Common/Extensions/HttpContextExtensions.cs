using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

namespace Umbraco.Extensions
{
    public static class HttpContextExtensions
    {


        /// <summary>
        /// Runs the authentication process
        /// </summary>
        public static async Task<AuthenticateResult> AuthenticateBackOfficeAsync(this HttpContext httpContext)
        {
            if (httpContext == null)
            {
                return AuthenticateResult.NoResult();
            }

            var result = await httpContext.AuthenticateAsync(Cms.Core.Constants.Security.BackOfficeAuthenticationType);
            return result;
        }

        /// <summary>
        /// Get the value in the request form or query string for the key
        /// </summary>
        public static string GetRequestValue(this HttpContext context, string key)
        {
            HttpRequest request = context.Request;
            if (!request.HasFormContentType)
            {
                return request.Query[key];
            }

            string value = request.Form[key];
            return value ?? request.Query[key];
        }

        public static void SetPrincipalForRequest(this HttpContext context, ClaimsPrincipal principal)
        {
            context.User = principal;
        }


        public static void SetReasonPhrase(this HttpContext httpContext, string reasonPhrase)
        {
            //TODO we should update this behavior, as HTTP2 do not have ReasonPhrase. Could as well be returned in body
            // https://github.com/aspnet/HttpAbstractions/issues/395
            var httpResponseFeature = httpContext.Features.Get<IHttpResponseFeature>();
            if (!(httpResponseFeature is null))
            {
                httpResponseFeature.ReasonPhrase = reasonPhrase;
            }
        }

        /// <summary>
        /// This will return the current back office identity.
        /// </summary>
        /// <param name="http"></param>
        /// <returns>
        /// Returns the current back office identity if an admin is authenticated otherwise null
        /// </returns>
        public static ClaimsIdentity GetCurrentIdentity(this HttpContext http)
        {
            if (http == null) throw new ArgumentNullException(nameof(http));
            if (http.User == null) return null; //there's no user at all so no identity

            // If it's already a UmbracoBackOfficeIdentity
            var backOfficeIdentity = http.User.GetUmbracoIdentity();
            if (backOfficeIdentity != null) return backOfficeIdentity;

            return null;
        }
    }
}
