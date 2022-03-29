using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace CastfluenceAPI.Controllers
{
    [ApiController]
    [Route("upload")]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;

        public TestController(ILogger<TestController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Route("audio")]
        public async Task<IActionResult> UploadAudios([FromForm(Name = "file")] IFormFile file)
        {
            return Ok();
        }


        [HttpGet]
        [Route("audio")]
        public async Task<IActionResult> test()
        {
            return Ok();
        }
    }
}
