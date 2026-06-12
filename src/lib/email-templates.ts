export function invitationEmail(params: {
  inviterName: string;
  teamName: string;
  role: string;
  acceptUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
          <tr>
            <td style="padding:32px 32px 0;text-align:center">
              <h1 style="margin:0;font-size:24px;color:#1a1a2e;letter-spacing:-0.5px">Scrumboard</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px">
              <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.5">
                <strong>${params.inviterName}</strong> invited you to join the team
                <strong>${params.teamName}</strong> as a <strong>${params.role}</strong>.
              </p>
              <div style="text-align:center;margin:24px 0">
                <a href="${params.acceptUrl}" style="display:inline-block;padding:12px 32px;background:#1a1a2e;color:#fff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:500">
                  Accept invitation
                </a>
              </div>
              <p style="margin:16px 0 0;font-size:13px;color:#888;line-height:1.4">
                This invitation will expire once cancelled by the team admin.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #eee;text-align:center">
              <p style="margin:0;font-size:12px;color:#aaa">
                Scrumboard — Project management platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
