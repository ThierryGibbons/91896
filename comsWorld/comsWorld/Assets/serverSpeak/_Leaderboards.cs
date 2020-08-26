using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class _Leaderboards : MonoBehaviour
{

    void Update()
    {
        if (Input.GetKeyDown("a"))
        {
            print("key 'a' was pressed");
            _SubmitScore(1, 100);
        }
    }

    private static string _Url = "http://localhost";
    private static string _Port = "8080";

    public void _SubmitScore(int which, int score)
    {
        StartCoroutine(_SubmitScoreToServer(which, score));
    }

    private IEnumerator _SubmitScoreToServer(int which, int score)
    {
        Debug.Log("Submitting score");

        // Create a form that will contain our data
        WWWForm form = new WWWForm();
        form.AddField("which", which.ToString());
        form.AddField("score", score.ToString());

        // Create a POST web request with our form data
        UnityWebRequest www = UnityWebRequest.Post(_Url + ":" + _Port, form);
        // Send the request and yield until the send completes
        yield return www.Send();

        if (www.isNetworkError)
        {
            // There was an error
            Debug.Log(www.error);
        }
        else
        {
            if (www.responseCode == 200)
            {
                // Response code 200 signifies that the server had no issues with the data we went
                Debug.Log("Form sent complete!");
                Debug.Log("Response:" + www.downloadHandler.text);
            }
            else
            {
                // Any other response signifies that there was an issue with the data we sent
                Debug.Log("Error response code:" + www.responseCode.ToString());
            }
        }
    }
}
